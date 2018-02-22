class DailyReportPDF
  include ActionView::Helpers::NumberHelper
  include PdfHelper

  def initialize(daily_report:)
    @date = daily_report.date
    @venue = daily_report.venue
    @daily_report = daily_report
  end
  attr_reader :date, :venue, :daily_report

  def render
    Prawn::Document.new(
      page_size: [800.00, 1600.00],
      page_layout: :landscape,
    ) do |pdf|
      use_ttf_font(pdf)

      pdf.font_size 26
      pdf.text report_title
      pdf.move_down 7

      render_overview(
        pdf: pdf,
        daily_report: daily_report
      )

      render_staff_member_sections(
        pdf: pdf,
        daily_report: daily_report
      )
    end.render
  end

  private
  def render_overview(pdf:, daily_report:)
    pdf.font_size 20
    pdf.text "<b>Overview</b>", inline_format: true
    pdf.move_down 5

    pdf.text "<i>Overheads</i>: #{number_to_currency(daily_report.overheads_cents / 100.0, unit: '£')}", inline_format: true
    pdf.move_down 5

    pdf.text "<i>Rotaed Cost - Overheads</i>: #{number_to_currency(daily_report.rotaed_cost_cents / 100.0, unit: '£')}", inline_format: true
    pdf.move_down 5

    pdf.text "<i>Actual Cost - Overheads:</i> #{number_to_currency(daily_report.actual_cost_cents / 100.0, unit: '£')}", inline_format: true
    pdf.move_down 5

    pdf.text "<i>Variance:</i> #{number_to_currency(daily_report.variance_cents / 100.0, unit: '£')}", inline_format: true
  end

  def render_staff_member_sections(pdf:, daily_report:)
    daily_report.staff_member_sections.each do |section|
      staff_type = section.staff_type

      pdf.start_new_page

      pdf.font_size 18
      pdf.text_box(
        staff_type.name.titlecase,
        style: :bold
      )
      pdf.move_down 28

      pdf.text total_message(section)

      pdf.font_size 14
      pdf.move_down 10

      render_staff_type_table(
        pdf: pdf,
        section: section
      )
    end
  end

  def report_title
    "#{venue.name.titlecase} Daily Report (#{date})"
  end

  def total_message(section)
    parts = []
    parts << "Rotaed Cost: #{number_to_currency(section.rotaed_cost_cents / 100.0, unit: '£') }"
    parts << "Actual Cost: #{number_to_currency(section.actual_cost_cents / 100.0, unit: '£')}"
    parts.join("\n")
  end

  def render_staff_type_table(pdf:, section:)
    pdf.table(
      section_table_data(section),
      header: 2,
      cell_style: {
        size: 16,
        inline_format: true,
        align: :center,
        overflow: :shrink_to_fit
      }
    ) do
      # Set minimum width
      cells.style do |cell|
        cell.width = [cell.width, 100].max
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

  def section_table_data(section)
    result = []
    result << heading1
    sort_staff_listings(section.staff_member_listings).each do |listing|
      result << listing_row(listing)
    end
    result
  end

  def heading1
    [
      bold_cell_content('Name'),
      bold_cell_content('Pay rate'),
      bold_cell_content('Hours Rotaed'),
      bold_cell_content('Rotaed Cost'),
      bold_cell_content('Hours Worked'),
      bold_cell_content('Break Time (Hours)'),
      bold_cell_content('Actual Cost')
    ]
  end

  def sort_staff_listings(listings)
    listings.sort do |a, b|

      a_names = a.staff_member.full_name.split(' ')
      b_names = b.staff_member.full_name.split(' ')
      a_sort_string = a_names.last + ' ' + a_names.first(a_names.length - 1).join(' ')
      b_sort_string = b_names.last + ' ' + b_names.first(b_names.length - 1).join(' ')
      a_sort_string <=> b_sort_string
    end
  end

  def listing_row(listing)
    result = []
    result << name_message(listing)
    result << pay_rate_message(listing)
    result << rotaed_hours_message(listing)

    result << rotaed_cost_message(listing)
    result << worked_hours_message(listing)
    result << break_hours_message(listing)
    result << actual_cost_message(listing)
    result
  end

  def name_message(listing)
    bold_cell_content(
      listing.staff_member.full_name.titlecase
    )
  end

  def pay_rate_message(listing)
    if listing.pay_rate_admin?
      listing.pay_rate_name.titlecase
    else
      listing.pay_rate_text_description_short
    end
  end

  def rotaed_cost_message(listing)
    if listing.pay_rate_hourly?
      bold_cell_content(
        number_to_currency(
          listing.rotaed_cost_cents / 100.0,
          unit: '£'
        )
      )
    else
      '-'
    end
  end

  def rotaed_hours_message(listing)
    number_with_precision(
      listing.rotaed_hours,
      precision: 2,
      strip_insignificant_zeros: true
    )
  end

  def worked_hours_message(listing)
    number_with_precision(
      listing.worked_hours,
      precision: 2,
      strip_insignificant_zeros: true
    )
  end

  def break_hours_message(listing)
    number_with_precision(
      listing.break_hours,
      precision: 2,
      strip_insignificant_zeros: true
    )
  end

  def actual_cost_message(listing)
    if listing.pay_rate_hourly?
      bold_cell_content(
        number_to_currency(listing.actual_cost_cents / 100, unit: '£')
      )
    else
      '-'
    end
  end

  def bold_cell_content(content)
    parts = ['<b>']
    parts << content
    parts << '</b>'
    parts.join('')
  end
end
