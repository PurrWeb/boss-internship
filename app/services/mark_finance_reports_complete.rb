class MarkFinanceReportsComplete
  def initialize(finance_reports:)
    @finance_reports = finance_reports
  end
  attr_reader :finance_reports

  def call
    unsaveable_reports = finance_reports.reject{ |report| report.ready? }
    if unsaveable_reports.length > 0
      raise "Attempt to complete incompletable finanace report for staff members with ids: #{ unsaveable_reports.map{ |report| report.staff_member_id }.join(', ') }"
    end

    ActiveRecord::Base.transaction do
      finance_reports.each do |report|
        report.allow_mark_completed = true
        report.mark_completed!
      end
    end
  end
end
