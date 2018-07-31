class MarkFinanceReportComplete
  def initialize(finance_report:)
    @finance_report = finance_report
  end
  attr_reader :finance_report

  def call
    raise "Attempt to complete incompleatable finanace report with id: #{result.report.id}" unless finance_report.ready?

    ActiveRecord::Base.transaction do
      report.allow_mark_completed = true
      finance_report.mark_completed!

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
