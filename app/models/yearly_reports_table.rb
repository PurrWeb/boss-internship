class YearlyReportsTable
  def initialize(tax_year:, venue:, filter_by_weekly_pay_rate: false)
    @tax_year = tax_year
    @venue = venue
    @filter_by_weekly_pay_rate = filter_by_weekly_pay_rate
    @empty = true
    generate_report_data
  end
  attr_reader :tax_year, :venue, :filter_by_weekly_pay_rate

  def empty?
    @empty
  end

  def staff_types
    @_staff_types
  end

  def dates
    @_reports_by_staff_type[staff_types.first].first.dates
  end

  def total(staff_type)
    @_totals_by_staff_type.fetch(staff_type).fetch(:total_cents) / 100.0
  end

  def reports(staff_type)
    @_reports_by_staff_type[staff_type].sort do |a, b|
      a_names = a.staff_member.full_name.split(' ')
      b_names = b.staff_member.full_name.split(' ')
      a_sort_string = a_names.last + ' ' + a_names.first(a_names.length - 1).join(' ')
      b_sort_string = b_names.last + ' ' + b_names.first(b_names.length - 1).join(' ')
      a_sort_string <=> b_sort_string
    end
  end

  def generate_report_data
    staff_members = FinanceReportStaffMembersQuery.new(
      venue: venue,
      start_date: tax_year.start_date,
      end_date: tax_year.end_date,
      filter_by_weekly_pay_rate: filter_by_weekly_pay_rate
    ).to_a
    ActiveRecord::Associations::Preloader.new.preload(staff_members, [:staff_type, :pay_rate, :name])


    @_staff_types = []
    @_reports_by_staff_type = {}
    @_totals_by_staff_type = {}

    staff_members.each do |staff_member|
      staff_type = staff_member.staff_type
      report = GenerateYearlyReportData.new(
        staff_member: staff_member,
        tax_year: tax_year
      ).call

      @_staff_types << staff_type unless @_staff_types.include?(staff_type)

      @_reports_by_staff_type[staff_type] ||= []
      @_reports_by_staff_type.fetch(staff_type) << report

      @_totals_by_staff_type[staff_type] ||= { total_cents: 0 }
      @_totals_by_staff_type[staff_type][:total_cents] += report.total_cents

      @empty = false
    end
  end
end
