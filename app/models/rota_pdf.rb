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
          size: 16
        }
      ) do
        row(0).font_style = :bold
      end
    end.render
  end
end
