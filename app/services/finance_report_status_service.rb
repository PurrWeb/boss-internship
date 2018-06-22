class FinanceReportStatusService
  def initialize(finance_report: )
    @finance_report = finance_report
  end

  def call
    days_needing_completion = days_with_pending_hour_acceptances.inject({}) do |acc, day|
      acc[UIRotaDate.format(day.date)] ||= []
      acc[UIRotaDate.format(day.date)] << "Pending hours acceptance period"
      acc
    end

    days_needing_completion = days_with_incomplete_clock_in_periods.inject(days_needing_completion) do |acc, day|
      acc[UIRotaDate.format(day.date)] ||= []
      acc[UIRotaDate.format(day.date)] << "Incomplete clock in period"
      acc
    end

    {
      can_complete: finance_report.can_complete?,
      status_text: finance_report.status,
      days_needing_completion: days_needing_completion
    }
  end

  private

  def staff_member_clocking_days
    InRangeQuery.new(
      relation: ClockInDay.where(venue: finance_report.venue, staff_member: finance_report.staff_member),
      start_value: finance_report.week.start_date,
      end_value: finance_report.week.end_date,
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
