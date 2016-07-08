class InRangeInclusive
  def initialize(start_column:, end_column:, start_value:, end_value:)
    @start_column = start_column
    @end_column = end_column
    @start_value = start_value
    @end_value = end_value
  end
  attr_reader :start_column, :end_column, :start_value, :end_value

  def arel
    end_column.gteq(start_value).and(start_column.lteq(end_value))
  end
end
