class RotaPDF
  def initialize(table_data)
    @table_data = table_data
  end
  attr_reader :table_data
  include PdfHelper

  def render
    Prawn::Document.new(
      page_size: [800.00, 1500.00],
      page_layout: :landscape,
    ) do |pdf|
      use_ttf_font(pdf)

      pdf.table(
        RotaPDFTableDataArray.new(data: table_data).to_a,
        header: true,
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
    end.render
  end
end
