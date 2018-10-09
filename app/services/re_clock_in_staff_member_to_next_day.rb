class ReClockInStaffMemberToNextDay
  def initialize(threshold_minutes: ReClockInStaffMemberToNextDayQuery::THRESHOLD_MINUTES)
    @threshold_minutes = threshold_minutes
  end

  def call(now: Time.now)
    date = RotaShiftDate.to_rota_date(now)
    business_day_start = RotaShiftDate.new(date).start_time
    requester = User.first
    week = RotaWeek.new(date)

    clock_in_periods = ReClockInStaffMemberToNextDayQuery
      .new(threshold_minutes: threshold_minutes)
      .all(date: date)

    clock_in_periods.each do |clock_in_period|
      venue = clock_in_period.venue
      staff_member = clock_in_period.staff_member

      result = ChangeClockInStatus.new(
        date: date,
        venue: venue,
        staff_member: staff_member,
        state: :clocked_in,
        at: business_day_start,
        requester: requester,
      ).call

      if result.success?
        if staff_member.can_have_finance_reports?
          MarkFinanceReportRequiringUpdate.new(staff_member: staff_member, week: week).call
        end
        clocking_app_frontend_updates = ClockingAppFrontendUpdates.new(venue_api_key: venue.api_key.key)
        clocking_app_frontend_updates.clocking_events_updates(clocking_event: result.clock_in_day.last_clock_in_event)
        clocking_app_frontend_updates.dispatch
      end
    end
  end

  private

  attr_reader :threshold_minutes
end
