require 'csv'

class SageFinanceReportExportCSV
  def initialize(finance_report_page_filter:)
    @venue = finance_report_page_filter.venue
    @week = finance_report_page_filter.week
    @filter_by_weekly_pay_rate = finance_report_page_filter.filter_staff_by_weekly_pay_rate?
  end
  attr_reader :venue, :week, :filter_by_weekly_pay_rate

  def to_s
    CSV.generate do |csv|
      csv << [
        'Employee Reference',
        'Payment Reference',
        'Hours'
      ]

    pay_rates = PayRate.all
    if filter_by_weekly_pay_rate
      pay_rates = PayRate.weekly
    end

    staff_members = StaffMember.
      where(
        master_venue: venue,
        pay_rate: pay_rates
      ).
      where('sage_id IS NOT ?', nil)

    staff_members = staff_members.
      includes([:name, :staff_type, :pay_rate, :master_venue])

    finance_reports = FinanceReport.
      where(
        venue: venue,
        week_start: week.start_date,
        staff_member: staff_members
      ).
      includes([:venue, :staff_member])

      finance_reports.find_each do |finance_report|
        staff_member = finance_report.staff_member

        csv << [
          staff_member.sage_id,
          1, # This is a basic payrate refrence setup in sage
          finance_report.total_hours_count
        ]
      end
    end
  end
end
