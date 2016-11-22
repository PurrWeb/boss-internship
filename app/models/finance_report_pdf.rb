class FinanceReportPDF
  include ActionView::Helpers::NumberHelper

  def initialize(venue:, week:, filter_by_weekly_pay_rate:, display_pay_rate_type: true, display_totals: true)
    @venue = venue
    @week = week
    @filter_by_weekly_pay_rate = filter_by_weekly_pay_rate
    @display_pay_rate_type = display_pay_rate_type
    @display_totals = display_totals
    @reports_by_staff_type = {}
  end
  attr_reader :week, :venue, :filter_by_weekly_pay_rate, :display_pay_rate_type, :display_totals, :reports_by_staff_type

  def add_report(staff_type:, report:)
    reports_by_staff_type[staff_type] ||= []
    reports_by_staff_type[staff_type] << report
  end

  def render
    Prawn::Document.new(
      page_size: [800.00, 1500.00],
      page_layout: :landscape,
    ) do |pdf|
      pdf.font_size 20
      pdf.text report_title

      pdf.font_size 14
      pdf.text filter_information
      pdf.move_down 7

      reports_by_staff_type.each_with_index do |(staff_type, reports), index|
        pdf.start_new_page if index > 0

        pdf.font_size 18
        if index == 0
          pdf.text_box(
            staff_type.name.titlecase,
            at: [0, 680]
          )
        else
          pdf.text_box staff_type.name.titlecase
        end

        pdf.move_down 28

        pdf.text total_message(reports)

        pdf.font_size 14
        render_staff_type_table(
          pdf: pdf,
          reports: reports
        )
      end
    end.render
  end

  private
  def render_staff_type_table(pdf:, reports:)
    pdf.table(
      reports_table_data(reports),
      header: 2,
      cell_style: {
        size: 16,
        inline_format: true
      }
    ) do
      # Ensure blank rows don't collapse
      (0..row_length).each do |index|
        cells = row(index)
        if cells.all? {|cell| cell.content.blank? }
          cells.style do |cell|
            cell.height = 24
            cell.width = [cell.width, 150].max
          end
        end
      end
    end
  end

  def report_title
    start_date = week.start_date.to_s(:human_date)
    end_date = week.end_date.to_s(:human_date)

    sections = []
    sections << venue.name.titlecase
    sections << " Finance Report"
    sections << " (#{start_date} - #{end_date})"
    sections.join("")
  end

  def filter_information
    if filter_by_weekly_pay_rate
     "Filter: weekly pay rates only"
    else
     "Filter: All records"
    end
  end

  def reports_table_data(reports)
    result = []
    result << heading1
    result << heading2
    sort_reports(reports).each do |report|
      result << report_row(report)
    end
    result
  end

  def heading1
    heading = []
    heading << ''
    heading << '' if display_pay_rate_type
    week.each do |date|
      heading << date
    end
    heading << ''
    heading << ''
    heading << '' if display_totals
    heading << '' if display_totals
    heading << ''
    heading
  end

  def heading2
    heading = []
    heading << 'Name'
    heading << 'Pay Type' if display_pay_rate_type
    week.each_with_day do |date, day|
      heading << day.to_s.titlecase
    end
    heading << 'Total Hours'
    heading << 'Owed Hours'
    heading << 'Pay Rate' if display_totals
    heading << 'Total' if display_totals
    heading << 'Paid Holiday (Days)'
  end

  def report_row(report)
    columns = []
    columns << report.staff_member_name.titlecase
    if display_pay_rate_type
      columns << report.staff_member.pay_rate.type_description
    end
    week.each_with_day do |date, day|
      hour_value = report.public_send("#{day}_hours_count".to_sym)
      if hour_value > 0
        columns << number_with_precision(
          hour_value,
          precision: 2,
          strip_insignificant_zeros: true
        )
      else
        columns << '-'
      end
    end
    columns << number_with_precision(
      report.total_hours_count,
      precision: 2,
      strip_insignificant_zeros: true
    )
    columns << number_with_precision(
      report.owed_hours_count,
      precision: 2,
      strip_insignificant_zeros: true
    )
    if display_totals
      columns << report.pay_rate_description
      columns << number_to_currency(report.total_cents / 100.0, unit: '£')
    end
    columns << report.holiday_days_count
    columns
  end

  def sort_reports(reports)
    reports.sort do |a, b|
      a_names = a.staff_member_name.split(' ')
      b_names = b.staff_member_name.split(' ')
      a_sort_string = a_names.last + ' ' + a_names.first(a_names.length - 1).join(' ')
      b_sort_string = b_names.last + ' ' + b_names.first(b_names.length - 1).join(' ')
      a_sort_string <=> b_sort_string
    end
  end

  def total_message(reports)
    total_figure = number_to_currency(
      reports.sum(&:total_cents) / 100.0,
      unit: '£'
    )
    "Total: #{total_figure}"
  end
end
