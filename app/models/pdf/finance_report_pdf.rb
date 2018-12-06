class FinanceReportPDF
  include ActionView::Helpers::NumberHelper
  include PdfHelper

  def initialize(
    report_title:,
    finance_report_page_filter:,
    display_pay_rate_type: true,
    display_totals: true
  )
    @report_title = report_title
    @venue = finance_report_page_filter.venue
    @week = finance_report_page_filter.week
    @filter_by_weekly_pay_rate = finance_report_page_filter.filter_staff_by_weekly_pay_rate?
    @display_pay_rate_type = display_pay_rate_type
    @display_totals = display_totals
    @reports_by_staff_type = {}
  end
  attr_reader :report_title, :week, :venue, :filter_by_weekly_pay_rate, :display_pay_rate_type, :display_totals, :reports_by_staff_type

  def add_report(staff_type:, report:)
    reports_by_staff_type[staff_type] ||= []
    reports_by_staff_type[staff_type] << report
  end

  def render
    Prawn::Document.new(
      page_size: [800.00, 1800.00],
      page_layout: :landscape,
    ) do |pdf|
      use_ttf_font(pdf)

      pdf.font_size 20
      pdf.text report_header

      pdf.font_size 14
      pdf.text filter_information

      reports_by_staff_type.each_with_index do |(staff_type, reports), index|
        pdf.move_down 25

        pdf.font_size 18
        pdf.text(
          staff_type.name.titlecase,
          style: :bold
        )

        if display_totals
          pdf.move_down 10
          pdf.text total_message(reports)
        end

        pdf.font_size 14
        pdf.move_down 10

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
        inline_format: true,
        align: :center,
        overflow: :shrink_to_fit
      }
    ) do
      cells.style do |cell|
        # Set minimum width
        cell.width = [cell.width, 100].max
        # Set maximum width
        cell.width = [cell.width, 130].min
      end

      (0..row_length).each do |index|
        cells = row(index)

        # Ensure blank rows don't collapse
        if cells.all? {|cell| cell.content.blank? }
          cells.style do |cell|
            cell.height = 24
          end
        end
      end
    end
  end

  def report_header
    start_date = week.start_date.to_s(:human_date)
    end_date = week.end_date.to_s(:human_date)

    sections = []
    sections << venue.name.titlecase
    sections << " #{report_title.titlecase}"
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
      heading << "<b>#{date.to_s(:short)}</b>"
    end
    heading << ''
    heading << ''
    heading << '' if display_totals
    heading << '' if display_totals
    heading << '' if display_totals
    heading << ''
    heading
  end

  def heading2
    heading = []
    heading << "<b>Name</b>"
    heading << '<b>Pay Type</b>' if display_pay_rate_type
    week.each_with_day do |date, day|
      heading << "<b>#{day.to_s.titlecase}</b>"
    end
    heading << '<b>Total Hours</b>'
    heading << '<b>Owed Hours</b>'
    heading << '<b>Accessories</b>' if display_totals
    heading << '<b>Pay Rate</b>' if display_totals
    heading << '<b>Total</b>' if display_totals
    heading << '<b>Paid Holiday (Days)</b>'
  end

  def report_row(report)
    columns = []
    columns << "<b>#{report.staff_member_name.titlecase}</b>"
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
      columns << number_to_currency(report.accessories_cents / 100.0, unit: '£')
      columns << report.pay_rate_description
      columns << "<b>#{number_to_currency(report.total_cents / 100.0, unit: '£')}</b>"
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
