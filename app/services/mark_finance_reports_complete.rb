class MarkFinanceReportsComplete
  def initialize(finance_reports:)
    @finance_reports = finance_reports
  end
  attr_reader :finance_reports

  def call
    unsaveable_reports = finance_reports.select do |finance_report|
      !finance_report.ready? || !finance_report.completion_date_reached? || (finance_report.total_cents < 0)
    end
    if unsaveable_reports.length > 0
      raise self.class.incompletable_report_attempt_error_message(staff_member_ids: unsaveable_reports.map{ |finance_report| finance_report.staff_member_id })
    end

    ActiveRecord::Base.transaction do
      finance_reports.each do |finance_report|
        finance_report.allow_mark_completed = true
        finance_report.mark_completed!
      end
    end
  end

  def self.incompletable_report_attempt_error_message(staff_member_ids:)
    "Attempt to complete incompletable finanace report for staff members with ids: #{ staff_member_ids.join(', ') }"
  end
end
