class ReClockInStaffMemberToNextDay
  def initialize(threshold_minutes: ReClockInStaffMemberToNextDayQuery::THRESHOLD_MINUTES)
    @threshold_minutes = threshold_minutes
  end

  def call(now: Time.current)
    rota_date = RotaShiftDate.to_rota_date(now)
    business_day_start = RotaShiftDate.new(rota_date).start_time
    week = RotaWeek.new(rota_date)

    # System user
    requester = User.first

    clock_in_periods = ReClockInStaffMemberToNextDayQuery
      .new(threshold_minutes: threshold_minutes)
      .all(date: rota_date)

    errors = []

    clock_in_periods.find_each do |clock_in_period|
      venue = clock_in_period.venue
      staff_member = clock_in_period.staff_member

      ActiveRecord::Base.transaction do
        begin
          result = ChangeClockInStatus.new(
            date: rota_date,
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
        rescue ActiveRecord::RecordInvalid
          errors << {
            venue_id: venue.id,
            venue_name: venue.name,
            staff_member_name: staff_member.full_name,
            staff_member_id: staff_member.id,
            date: rota_date,
          }
          raise ActiveRecord::Rollback
        end
      end
    end
    if errors.count > 1
      Rollbar.error('Failed to reclock-in staff members', error_count: errors.count, error_data: errors)
    end
  end

  private

  attr_reader :threshold_minutes
end
