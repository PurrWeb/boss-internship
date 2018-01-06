class ChangeOrderCompletionPDF
  include ActionView::Helpers::NumberHelper

  def initialize(generated_at:, change_orders:)
    @generated_at = generated_at
    @change_orders = change_orders
  end
  attr_reader :generated_at, :change_orders

  def render
    Prawn::Document.new(
      page_size: [800.00, [1000.00, page_width.to_f].max],
      page_layout: :landscape,
    ) do |pdf|
      render_header(
        pdf: pdf,
        generated_at: generated_at
      )
      pdf.move_down 10

      render_table(
        pdf: pdf,
        change_orders: change_orders
      )
    end.render
  end

  private
  def page_width
    margin_width = 20
    venue_name_column_width = 25
    site_id_column_width = 22
    amout_column_width = 20
    total_colum_width = 20

    margin_width +
      venue_name_column_width +
      site_id_column_width +
      (amout_column_width * 6) +
      total_colum_width
  end

  def render_header(pdf:, generated_at:)
    pdf.font_size 20
    pdf.text "Change Order Completions #{generated_at.to_s(:human)}"
  end

  def render_table(pdf:, change_orders:)
    pdf.table(
      table_data(change_orders),
      cell_style: {
        size: 16,
        inline_format: true,
        align: :center,
        overflow: :shrink_to_fit
      }
    )
  end

  def heading_data
    [
      "<b>Venue</b>",
      "<b>Site ID</b>",
      "<b>£5</b>",
      "<b>£1</b>",
      "<b>50p</b>",
      "<b>20p</b>",
      "<b>10p</b>",
      "<b>5p</b>",
      "<b>Total</b>"
    ]
  end

  def change_order_row_data(change_order)
    [
      change_order.venue.name.titlecase,
      change_order.venue.change_order_site_id || "",
        number_to_currency(
          change_order.five_pound_notes,
          unit: '£',
          precision: 2
        ),
      number_to_currency(
        change_order.one_pound_coins, unit: '£', precision: 2
      ),
      number_to_currency(
        change_order.fifty_pence_coins, unit: '£', precision: 2
      ),
      number_to_currency(
        change_order.twenty_pence_coins, unit: '£', precision: 2
      ),
      number_to_currency(
        change_order.ten_pence_coins, unit: '£', precision: 2
      ),
      number_to_currency(
        change_order.five_pence_coins, unit: '£', precision: 2
      ),
      number_to_currency(
        change_order.total, unit: '£', precision: 2
      )
    ]
  end

  def table_data(change_orders)
    result = []
    result << heading_data
    change_orders.each do |change_order|
      result << change_order_row_data(change_order)
    end
    result
  end
end
