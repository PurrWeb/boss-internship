class SaveFinanceReports
  def initialize(staff_members:, week:)
    @staff_members = staff_members
    @week = week
  end
  attr_reader :week, :staff_members

  def call
    report_results = staff_members.map do |staff_member|
      GenerateFinanceReportData.new(
        staff_member: staff_member,
        week: week
      ).call
    end

    unsaveable_reports = report_results.map(&:report).reject{ |report| FinanceReportService.new(finance_report: report).can_complete? }
    if unsaveable_reports.length > 0
      raise "Attempt to complete incompletable finanace report for staff members with ids: #{ unsaveable_reports.map{ |report| report.staff_member_id }.join(', ') }"
    end

    ActiveRecord::Base.transaction do
      report_results.each do |report_result|
        report = report_result.report
        report.save!

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
