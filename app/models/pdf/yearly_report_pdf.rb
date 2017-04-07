class YearlyReportPDF
  include ActionView::Helpers::NumberHelper

  def initialize(venue:, tax_year:, yearly_reports_table:, time_stamp:)
    @venue = venue
    @tax_year = tax_year
    @yearly_reports_table = yearly_reports_table
    @time_stamp = time_stamp
  end
  attr_reader :venue, :tax_year, :yearly_reports_table, :time_stamp

  def render
    Prawn::Document.new(
      page_size: [800.00, 7300.00],
      page_layout: :landscape,
    ) do |pdf|
      pdf.font_size 20
      pdf.text report_header

      yearly_reports_table.staff_types.each do |staff_type|
        pdf.move_down 25

        pdf.font_size 18
        pdf.text(
          staff_type.name.titlecase,
          style: :bold
        )
        pdf.move_down 10

        pdf.text total_message(total: yearly_reports_table.total(staff_type))

        pdf.font_size 14
        pdf.move_down 10

        render_staff_member_reports_table(
          pdf: pdf,
          yearly_reports_table: yearly_reports_table,
          staff_type: staff_type
        )
      end
    end.render
  end

  def report_header
    year = tax_year.year

    sections = []
    sections << venue.name.titlecase
    sections << " #{year} Yearly report"
    sections << " (generated #{time_stamp})"
    sections.join("")
  end

  def total_message(total:)
    total_string = number_to_currency(
      total,
      unit: '£'
    )
    "Total: #{total_string}"
  end

  def render_staff_member_reports_table(pdf:, yearly_reports_table:, staff_type:)
    pdf.table(
      reports_table_data(
        yearly_reports_table: yearly_reports_table,
        staff_type: staff_type
      ),
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
        cell.width = [cell.width, 120].min
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

  def reports_table_data(yearly_reports_table:, staff_type:)
    result = []
    result << heading1(yearly_reports_table: yearly_reports_table)
    result << heading2(yearly_reports_table: yearly_reports_table)
    yearly_reports_table.reports(staff_type).each do |report|
      result << report_row(report: report, dates: yearly_reports_table.dates)
    end
    result
  end

  def heading1(yearly_reports_table:)
    heading = []
    heading << ''
    heading << 'Week'
    yearly_reports_table.dates.each_with_index do |date, index|
      heading << (index + 1)
    end
    heading << ''
    heading << ''
    heading << ''
    heading << ''
    heading << ''
    heading
  end

  def heading2(yearly_reports_table:)
    heading = []
    heading << "<b>Name</b>"
    heading << '<b>Pay Type</b>'
    yearly_reports_table.dates.each do |date|
      week = RotaWeek.new(date)
      start_date = [week.start_date, tax_year.start_date].max
      end_date = [week.end_date, tax_year.end_date].min
      heading << "#{start_date.to_date.to_s(:short).html_safe} - #{end_date.to_date.to_s(:short)}"
    end
    heading << '<b>Total Hours</b>'
    heading << '<b>Owed Hours</b>'
    heading << '<b>Pay Rate</b>'
    heading << '<b>Total</b>'
    heading << '<b>Paid Holiday (Days)</b>'
  end

  def report_row(report:, dates:)
    columns = []
    columns << "<b>#{report.staff_member.full_name.titlecase}</b>"
    columns << report.staff_member.pay_rate.type_description
    dates.each do |date|
      rota_week = RotaWeek.new(date)
      hour_value = report.hours_count(rota_week: rota_week)
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
    columns << report.staff_member.pay_rate.text_description_short
    columns << "<b>#{number_to_currency(report.total_cents / 100.0, unit: '£')}</b>"

    columns << report.holiday_days_count
    columns
  end
end
