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
  end

  def call
    result = false

    ActiveRecord::Base.transaction do
      old_master_venue = staff_member.master_venue
      old_pay_rate = staff_member.pay_rate

      staff_member.assign_attributes(params)
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
