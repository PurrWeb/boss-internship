class UpdateStaffMemberEmploymentDetails
  class Result < Struct.new(:success, :staff_member)
    def success?
      success
    end
  end

  def initialize(requester:, staff_member:, params:, migrate_finance_report_venue_service: MigrateIncompleteFinanceReportsToVenue)
    @requester = requester
    @staff_member = staff_member
    @params = params
    @requester = requester
    @migrate_finance_report_venue_service = migrate_finance_report_venue_service
  end

  def call(now: Time.current)
    result = false

    ActiveRecord::Base.transaction do
      old_master_venue = staff_member.master_venue
      old_sage_id = staff_member.sage_id
      old_pay_rate = staff_member.pay_rate

      staff_member.assign_attributes(params)

      StaffMemberPostAssignAccessiblePayRateValidation.new(requester: requester).call(staff_member: staff_member)

      # Used below for system updates
      pay_rate_changed = staff_member.pay_rate_id_changed?
      master_venue_changed = old_master_venue != staff_member.master_venue
      sage_id_changed = old_sage_id != staff_member.sage_id

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

      #Sage ID at new venue is different
      if master_venue_changed && !sage_id_changed
        staff_member.sage_id = nil
      end

      result = staff_member.save
      raise ActiveRecord::Rollback unless result

      incomplete_finance_reports = staff_member.finance_reports.not_in_state([FinanceReportStateMachine::DONE_STATE, FinanceReportStateMachine::REQUIRING_UPDATE_STATE])
      if master_venue_changed
        migrate_finance_report_venue_service.new(
          new_master_venue: staff_member.master_venue,
          staff_member: staff_member,
          nested: true
        ).call
      elsif pay_rate_changed
        incomplete_finance_reports.find_each do |finance_report|
          finance_report.mark_requiring_update!
        end

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

      if staff_member_updates_email.send?
        StaffMemberUpdatesMailer.staff_member_updated(staff_member_updates_email.data).deliver_now
      end
    end

    Result.new(result, staff_member)
  end

  private
  attr_reader :now, :staff_member, :params, :requester, :migrate_finance_report_venue_service

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
