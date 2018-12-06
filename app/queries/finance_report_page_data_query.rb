class FinanceReportPageDataQuery
  def initialize(finance_report_page_filter:, use_frontend_filtering:)
    # Certain filtering will be ignored and performend on the
    # frontend when this is set to true
    @use_frontend_filtering = use_frontend_filtering

    @finance_report_page_filter = finance_report_page_filter
  end
  attr_reader :finance_report_page_filter, :use_frontend_filtering

  def call
    pay_rates = PayRate.all
    if !use_frontend_filtering
      pay_rates = PayRate.weekly if finance_report_page_filter.filter_staff_by_weekly_pay_rate?
    end

    staff_members = StaffMember.
      where(
        pay_rate: pay_rates
      )

    finance_reports = FinanceReport.
      where(
        venue: finance_report_page_filter.venue,
        week_start: finance_report_page_filter.week.start_date,
        staff_member: staff_members
      )

    staff_types = StaffType.
      joins(:staff_members).
      merge(staff_members).
      uniq

    {
      pay_rates: pay_rates,
      staff_members: staff_members,
      finance_reports: finance_reports,
      staff_types: staff_types
    }
  end
end
