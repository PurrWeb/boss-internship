class InRangeQuery
  def initialize(relation:, start_value:, end_value:, start_column_name: 'starts_at', end_column_name: 'ends_at', table_name: nil, include_boundaries: true)
    @relation = relation
    @start_value = start_value
    @end_value = end_value
    @start_column_name = start_column_name
    @end_column_name = end_column_name
    @table_name = table_name
    @include_boundaries = include_boundaries
  end

  def all
    if include_boundaries
      relation.where("(#{start_column_string} <= ?) AND (#{end_column_string} >= ?)", end_value, start_value)
    else
      relation.where("(#{start_column_string} < ?) AND (#{end_column_string} > ?)", end_value, start_value)
    end
  end

  private
  attr_reader \
    :relation,
    :start_value,
    :end_value,
    :start_column_name,
    :end_column_name,
    :include_boundaries,
    :table_name

  def table_name_string
    "`#{table_name}`." if table_name.present?
  end

  def start_column_string
    "#{table_name_string}`#{start_column_name}`"
  end

  def end_column_string
    "#{table_name_string}`#{end_column_name}`"
  end
end
