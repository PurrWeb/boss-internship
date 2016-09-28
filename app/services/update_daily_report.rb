class UpdateDailyReport
  def initialize(report: report)
    @daily_report = report
  end
  attr_reader :daily_report

  def call
    date = daily_report.date
    venue = daily_report.venue

    daily_report_summary = DailyReportSummaryCalculator.new(
      date: date,
      venue: venue
    )

    staff_members = daily_report_summary.staff_members
    grouped_staff_members = staff_members.group_by(&:staff_type)

    data = daily_report_summary.calculate

    last_update_requested_at = daily_report.last_update_requested_at

    ActiveRecord::Base.transaction do
      daily_report.update_attributes!(
        overheads_cents: data.fetch(:overheads_cents),
        rotaed_cost_cents: data.fetch(:rotaed_cost_minus_overheads_cents),
        actual_cost_cents: data.fetch(:actual_cost_minus_overheads_cents),
        last_calculated_at: Time.current,
        last_update_request_serviced: last_update_requested_at
      )

      #clear old cached sections
      DailyReportStaffMemberSection.where(daily_report: daily_report).destroy_all

      grouped_staff_members.each do |staff_type, staff_members|
        group_data = {
          overhead_cost_cents: 0,
          rotaed_cost_cents: 0,
          actual_cost_cents: 0
        }

        staff_members.each do |staff_member|
          group_data[:overhead_cost_cents] += staff_member.overhead_cost_cents.to_i
          group_data[:rotaed_cost_cents] += staff_member.rotaed_cost_cents.to_i
          group_data[:actual_cost_cents] += staff_member.actual_cost_cents.to_i
        end

        section = daily_report.staff_member_sections.create!(
          staff_type: staff_type,
          overhead_cost_cents: group_data.fetch(:overhead_cost_cents),
          rotaed_cost_cents: group_data.fetch(:rotaed_cost_cents),
          actual_cost_cents: group_data.fetch(:actual_cost_cents)
        )

        staff_members.each do |staff_member|
          section.staff_member_listings.create!(
            staff_member: staff_member,
            rotaed_cost_cents: staff_member.rotaed_cost_cents.to_i,
            actual_cost_cents: staff_member.actual_cost_cents.to_i,
            break_hours: staff_member.break_hours,
            rotaed_hours: staff_member.hours_rotaed,
            worked_hours: staff_member.hours_worked,
            pay_rate_name: staff_member.pay_rate.name,
            pay_rate_cents: staff_member.pay_rate.cents,
            pay_rate_calculation_type: staff_member.pay_rate.calculation_type,
            pay_rate_admin: !!staff_member.pay_rate.admin?,
            pay_rate_text_description_short: staff_member.pay_rate.text_description_short
          )
        end
      end
    end
  end
end
