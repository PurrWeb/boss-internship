class MarkFinanceReportsComplete
  def initialize(finance_reports:)
    @finance_reports = finance_reports
  end
  attr_reader :finance_reports

  def call
    unsaveable_reports = finance_reports.reject{ |report| !report.ready? }
    if unsaveable_reports.length > 0
      raise "Attempt to complete incompletable finanace report for staff members with ids: #{ unsaveable_reports.map{ |report| report.staff_member_id }.join(', ') }"
    end

    ActiveRecord::Base.transaction do
      finance_reports.each do |report|
        report.allow_mark_completed = true
        report.mark_completed!

        report_result.hours_acceptance_periods.each do |hours_acceptance_period|
          hours_acceptance_period.update_attributes!(frozen_by: report)
        end

        report_result.holidays.each do |holiday|
          holiday.update_attributes!(frozen_by: report)
        end

        report_result.owed_hours.each do |owed_hour|
          owed_hour.update_attributes!(frozen_by: report)
        end
      end
    end
  end
end
