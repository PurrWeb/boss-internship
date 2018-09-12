class MarkFinanceReportsComplete
  def initialize(finance_reports:, now: Time.current)
    @finance_reports = finance_reports
    @now = now
  end
  attr_reader :finance_reports, :now

  def call
    unsaveable_reports = finance_reports.select do |finance_report|
      !finance_report.ready? || !finance_report.completion_date_reached?
    end
    if unsaveable_reports.length > 0
      raise self.class.incompletable_report_attempt_error_message(staff_member_ids: unsaveable_reports.map{ |finance_report| finance_report.staff_member_id })
    end

    ActiveRecord::Base.transaction do
      finance_reports.each do |finance_report|
        if finance_report.total_cents < 0
          # Move all accessory requests to next weeks finance report
          next_available_week = NextEditableFinanceReportWeek.new(
            staff_member: finance_report.staff_member,
            week: RotaWeek.new(finance_report.week_start)
          ).call
          accessory_requests = AccessoryRequest.where(finance_report: finance_report)
          accessory_requests_cents = accessory_requests.reduce(0) do |sum, request|
            sum + request.price_cents
          end
          future_finance_report = MarkFinanceReportRequiringUpdate.new(
            staff_member: finance_report.staff_member,
            week: next_available_week
          ).call
          accessory_requests.each do |accessory_request|
            accessory_request.allowing_past_payslip_date_manupulation do |request|
              request.update_attributes!(
                finance_report: future_finance_report,
                payslip_date: next_available_week.start_date
              )
            end
          end

          #Patch finance report data
          finance_report.update_attributes!(
            total_cents: finance_report.total_cents + accessory_requests_cents,
            accessories_cents: finance_report.accessories_cents + accessory_requests_cents
          )
        end

        finance_report.allow_mark_completed = true
        finance_report.mark_completed!
      end
    end
  end

  def self.incompletable_report_attempt_error_message(staff_member_ids:)
    "Attempt to complete incompletable finanace report for staff members with ids: #{ staff_member_ids.join(', ') }"
  end
end
