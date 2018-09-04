class MarkFinanceReportsComplete
  def initialize(finance_reports:)
    @finance_reports = finance_reports
  end
  attr_reader :finance_reports

  def call
    unsaveable_reports = finance_reports.reject do |finance_report|
      finance_report.ready? || finance_report.completion_date_reached? || (finance_report.total_cents >= 0)
    end
    if unsaveable_reports.length > 0
      raise "Attempt to complete incompletable finanace report for staff members with ids: #{ unsaveable_reports.map{ |finance_report| finance_report.staff_member_id }.join(', ') }"
    end

    ActiveRecord::Base.transaction do
      finance_reports.each do |finance_report|
        finance_report.allow_mark_completed = true
        finance_report.mark_completed!
      end
    end
  end
end
