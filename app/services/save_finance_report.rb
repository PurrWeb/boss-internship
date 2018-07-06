class SaveFinanceReport
  def initialize(staff_member:, week:)
    @staff_member = staff_member
    @week = week
  end
  attr_reader :week, :staff_member

  def call
    result = GenerateFinanceReportData.new(
      staff_member: staff_member,
      week: week
    ).call

    raise "Attempt to complete incompleatable finanace report with id: #{result.report.id}" unless FinanceReportCompletionStatus.new(finance_report: result.report).can_complete?

    ActiveRecord::Base.transaction do
      report = result.report

      report.save!

      result.hours_acceptance_periods.each do |hours_acceptance_period|
        hours_acceptance_period.update_attributes!(frozen_by: report)
      end

      result.holidays.each do |holiday|
        holiday.update_attributes!(frozen_by: report)
      end

      result.owed_hours.each do |owed_hour|
        owed_hour.update_attributes!(frozen_by: report)
      end

      result.accessories_requests.each do |request|
        request.update_attributes!(frozen_by: report)
      end

      result.accessories_refunds.each do |refund|
        refund.update_attributes!(frozen_by: report)
      end
    end
  end
end
