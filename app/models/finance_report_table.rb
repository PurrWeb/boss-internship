class FinanceReportTable
  def initialize(week:, venue:, filter_by_weekly_pay_rate:)
    @week = week
    @venue = venue
    @filter_by_weekly_pay_rate = filter_by_weekly_pay_rate
    generate_report_data
  end
  attr_reader :week, :venue, :filter_by_weekly_pay_rate

  def staff_types
    @_staff_types
  end

  def reports(staff_type)
    @_reports_by_staff_type.fetch(staff_type).sort do |a, b|
      a_names = a.staff_member_name.split(' ')
      b_names = b.staff_member_name.split(' ')
      a_sort_string = a_names.last + ' ' + a_names.first(a_names.length - 1).join(' ')
      b_sort_string = b_names.last + ' ' + b_names.first(b_names.length - 1).join(' ')
      a_sort_string <=> b_sort_string
    end
  end

  def total(staff_type)
    @_reports_by_staff_type.fetch(staff_type).sum(&:total_cents) / 100.0
  end

  private
  def generate_report_data
    finance_reports = FinanceReport.where(
      venue: venue,
      week_start: week.start_date
    ).includes(staff_member: [:staff_type])

    @_staff_types = []
    @_reports_by_staff_type ||= begin
      result = {}
      finance_reports.each do |finance_report|
        #TODO: Filter by weekly payrate
        staff_member = finance_report.staff_member

        @_staff_types << staff_member.staff_type unless @_staff_types.include?(staff_member.staff_type)
        result[staff_member.staff_type] ||= []
        result[staff_member.staff_type] << finance_report
      end
      result
    end
  end
end
