class UpdateStaffMemberEmploymentDetails
  class Result < Struct.new(:success, :staff_member)
    def success?
      success
    end
  end

  def initialize(now: Time.zone.now, requester:, staff_member:, params:)
    @now = now
    @requester = requester
    @staff_member = staff_member
    @params = params
    @requester = requester
  end

  def call
    result = false

    ActiveRecord::Base.transaction do
      old_master_venue = staff_member.master_venue
      old_pay_rate = staff_member.pay_rate

      work_venues_ids = staff_member.work_venues.map(&:id)
      new_work_venues = params[:work_venues]
      new_work_venues_ids = new_work_venues.map(&:id)
      changed_work_venues = new_work_venues.select {|venue| work_venues_ids.exclude?(venue.id)}

      # Check if the new work venues present and if the user have an access for them
      # If user doesn't have access, set error string and mode additional fields for validation
      if changed_work_venues.present?
        venues_without_access = changed_work_venues.inject([]) do |result, venue|
          AccessibleVenuesQuery.new(requester).all.include?(venue) ? result : result << venue.name
        end
        if venues_without_access.present?
          # These are used to trigger a conditional valdition error on the model
          staff_member.work_venues_without_access = venues_without_access

          # Remove `work_venues` from params, because if not,
          # `assign_attributes` method saves this venues, even the validation is wrong
          params.delete(:work_venues)
        end
      end

      staff_member.assign_attributes(params)

      StaffMemberPostAssignAccessiblePayRateValidation.new(requester: requester).call(staff_member: staff_member)

      if staff_member.master_venue.present? && staff_member.master_venue_id_changed?
        if !AccessibleVenuesQuery.new(requester).all.include?(staff_member.master_venue)
          # Used to trigger conditional validation error
          staff_member.has_master_venue_without_access = true
        end
      end

      # Used below for system updates
      pay_rate_changed = staff_member.pay_rate_id_changed?

      if staff_member.security? && staff_member.sia_badge_expiry_date.present? && staff_member.sia_badge_expiry_date_changed?
        if staff_member.sia_badge_expiry_date < now
          # Notification will not be sent
          staff_member.notified_of_sia_expiry_at = now
        else
          # Send notification when in expiry period
          staff_member.notified_of_sia_expiry_at = nil
        end
      end

      staff_member_updates_email = StaffMemberUpdatesEmail.new(
        user: requester,
        staff_member: staff_member,
        old_master_venue: old_master_venue
      )

      result = staff_member.save

      if result && pay_rate_changed
        rotas = CurrentAndFutureRotasQuery.new(relation: Rota.with_forecasts).all.
          joins(:rota_shifts).
          merge(
            RotaShift.where(staff_member: staff_member)
          )

        rotas.each do |rota|
          UpdateRotaForecast.new(rota: rota).call
        end

        update_related_daily_reports(
          staff_member: staff_member,
          old_pay_rate: old_pay_rate,
          new_pay_rate: staff_member.pay_rate
        )
      end

      if result && staff_member_updates_email.send?
        StaffMemberUpdatesMailer.staff_member_updated(staff_member_updates_email.data).deliver_now
      end
    end

    Result.new(result, staff_member)
  end

  private
  attr_reader :now, :staff_member, :params, :requester

  def update_related_daily_reports(staff_member:, old_pay_rate:, new_pay_rate:)
    if [old_pay_rate, new_pay_rate].any? { |pay_rate| pay_rate.weekly? }
      DailyReportDatesEffectedByStaffMemberOnWeeklyPayRateQuery.new(
        staff_member: staff_member
      ).to_a.each do |date, venue|
        DailyReport.mark_for_update!(date: date, venue: venue)
      end
    end

    if [old_pay_rate, new_pay_rate].any? { |pay_rate| pay_rate.hourly? }
      DailyReportDatesEffectedByStaffMemberOnHourlyPayRateQuery.new(
        staff_member: staff_member
      ).to_a.each do |date, venue|
        DailyReport.mark_for_update!(date: date, venue: venue)
      end
    end
  end
end
