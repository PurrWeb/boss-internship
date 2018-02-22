class FruitOrderCompletionPDF
  include ActionView::Helpers::NumberHelper
  include PdfHelper

  def initialize(generated_at:, fruit_orders:)
    @generated_at = generated_at
    @fruit_orders = fruit_orders
    @show_fields = FruitOrderShowFields.new(fruit_orders)
  end
  attr_reader :generated_at, :fruit_orders, :show_fields

  def render
    Prawn::Document.new(
      page_size: [800.00, [1000.00, page_width.to_f].max],
      page_layout: :landscape,
    ) do |pdf|
      use_ttf_font(pdf)

      render_header(
        pdf: pdf,
        generated_at: generated_at
      )
      pdf.move_down 10

      render_table(
        pdf: pdf,
        fruit_orders: fruit_orders
      )
    end.render
  end

  private
  def page_width
    margin_width = 20
    fruit_title_column_width = 45
    venue_name_column_width = 25
    total_colum_width = 20

    margin_width +
      fruit_title_column_width +
      (venue_name_column_width * fruit_orders.count) +
      total_colum_width
  end

  def render_header(pdf:, generated_at:)
    pdf.font_size 20
    pdf.text "Fruit Order Completions #{generated_at.to_s(:human)}"
  end

  def render_table(pdf:, fruit_orders:)
    pdf.table(
      table_data(fruit_orders),
      cell_style: {
        size: 16,
        inline_format: true,
        align: :center,
        overflow: :shrink_to_fit
      }
    )
  end

  def heading_data
    result = []
    result << "<b>Venue</b>"
    fruit_orders.map(&:venue).each do |venue|
      result << "<b>#{venue.name.titlecase}</b>"
    end
    result << "<b>Total</b>"
    result
  end

  def fruit_order_field_row_data(field)
    result = []
    result << "<b>#{FruitOrder.message_for(field)}</b>"
    fruit_orders.each do |fruit_order|
      result << fruit_order.public_send(field)
    end
    result << fruit_orders.to_a.sum { |fo| fo.public_send(field) }
    result
  end

  def table_data(fruit_orders)
    result = []
    result << heading_data
    show_fields.each do |field|
      result << fruit_order_field_row_data(field)
    end
    result
  end
end
