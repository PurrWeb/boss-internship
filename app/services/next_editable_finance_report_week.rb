# Returns next non completed finance report week from a given point
class NextEditableFinanceReportWeek
  def initialize(staff_member:, week:, now: Time.current)
    @staff_member  = staff_member
    @week = week
    @now = now
  end
  attr_reader :staff_member, :week, :now

  def call
    result_week = nil
    target_week = week
    target_week = RotaWeek.new(week.start_date + 1.week)
    while !result_week.present?
      target_week_finance_report = FinanceReport.find_by(
        staff_member: staff_member,
        week_start: target_week.start_date
      )
      if !target_week_finance_report.present? || !target_week_finance_report.done?
        result_week = target_week
      end
      target_week = RotaWeek.new(target_week.start_date + 1.week)
    end
    result_week
  end
end

