class GetPendingHoursStatus
  def initialize(week:, staff_member:)
    @week = week
    @staff_member = staff_member
  end
  attr_reader :week, :staff_member

  def status_data
    {
      can_complete: days_needing_completion.count == 0,
      days_needing_completion: days_needing_completion
    }
  end

  private
  def days_needing_completion
    pending_hours_acceptance_priod_days_data = days_with_pending_hour_acceptances.inject({}) do |acc, day|
      acc[UIRotaDate.format(day.date)] ||= []
      acc[UIRotaDate.format(day.date)] << "Pending hours acceptance period"
      acc
    end

    all_issued_days_data = days_with_incomplete_clock_in_periods.inject(pending_hours_acceptance_priod_days_data) do |acc, day|
      acc[UIRotaDate.format(day.date)] ||= []
      acc[UIRotaDate.format(day.date)] << "Incomplete clock in period"
      acc
    end
    all_issued_days_data
  end

  def staff_member_clocking_days
    InRangeQuery.new(
      relation: ClockInDay.where(staff_member: staff_member),
      start_value: week.start_date,
      end_value: week.end_date,
      start_column_name: 'date',
      end_column_name: 'date'
    ).all
  end

  def days_with_pending_hour_acceptances
    pending_hour_acceptances = HoursAcceptancePeriod.pending.where(
      clock_in_day: staff_member_clocking_days
    )
    ClockInDay.where(
      id: pending_hour_acceptances.map(&:clock_in_day_id)
    )
  end

  def days_with_incomplete_clock_in_periods
    incomplete_clock_in_periods = ClockInPeriod.incomplete.where(
      clock_in_day: staff_member_clocking_days
    )
    ClockInDay.where(
      id: incomplete_clock_in_periods.map(&:clock_in_day_id)
    )
  end

  attr_reader :finance_report
end
