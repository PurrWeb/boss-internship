class FinanceReportService
  def initialize(finance_report: )
    @finance_report = finance_report
  end

  def status_data
    {
      can_complete: can_complete?,
      status_text: status_text,
      days_needing_completion: days_needing_completion
    }
  end

  def can_complete?
    return false if finance_report.persisted?
    return false if finance_report.week >= RotaWeek.new(RotaShiftDate.to_rota_date(Time.current))

    days_needing_completion.size == 0
  end

  def status_text
    if finance_report.new_record?
      can_complete? ? FinanceReport::REPORT_STATUS_READY_STATUS : FinanceReport::REPORT_STATUS_INCOMPLETE_STATUS
    else
      FinanceReport::REPORT_STATUS_DONE_STATUS
    end
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
