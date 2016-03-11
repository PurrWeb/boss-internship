class RotaPDF
  def initialize(table_data)
    @table_data = table_data
  end
  attr_reader :table_data

  def render
    Prawn::Document.new(
      page_size: [800.00, 1500.00],
      page_layout: :landscape,
    ) do |pdf|
      pdf.table(
        RotaPDFTableDataArray.new(data: table_data).to_a,
        header: true,
        column_widths: {
          0 => 140
        },
        cell_style: {
          size: 16,
          inline_format: true
        }
      ) do
        # Ensure blank rows don't collapse
        (0..row_length).each do |index|
          cells = row(index)
          if cells.all? {|cell| cell.content.blank? }
            cells.style { |cell| cell.height = 24 }
          end
        end
      end
    end.render
  end
end
