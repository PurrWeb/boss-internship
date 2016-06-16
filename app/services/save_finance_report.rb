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

    ActiveRecord::Base.transaction do
      report = result.report

      report.save!

      result.hours_acceptance_periods.each do |hours_acceptance_period|
        hours_acceptance_period.update_attributes!(frozen_by: report)
      end

      result.holidays.each do |holiday|
        holiday.update_attributes!(frozen_by: report)
      end

      result.old_hours.each do |old_hour|
        old_hour.update_attributes!(frozen_by: report)
      end
    end
  end
end
