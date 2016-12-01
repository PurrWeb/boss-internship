class RotaPDFTableDataArray
  def initialize(data:)
    @data = data
  end

  def to_a
    result = []

    header_row = data.header_row
    result << [
      header_row.name,
      header_row.monday,
      header_row.tuesday,
      header_row.wednesday,
      header_row.thursday,
      header_row.friday,
      header_row.saturday,
      header_row.sunday,
      header_row.total_hours
    ]

    data.data_rows.each do |row|
      result << [
        row.name,
        row.monday,
        row.tuesday,
        row.wednesday,
        row.thursday,
        row.friday,
        row.saturday,
        row.sunday,
        row.total_hours
      ]
    end

    result
  end

  private
  attr_reader :data
end
