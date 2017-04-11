class InRangeQuery
  def initialize(relation:, start_value:, end_value:, start_column_name: 'starts_at', end_column_name: 'ends_at', table_name: nil, include_boundaries: [:start, :end])
    @relation = relation
    @start_value = start_value
    @end_value = end_value
    @start_column_name = start_column_name
    @end_column_name = end_column_name
    @table_name = table_name
    include_boundaries.each do |boundary|
      raise "invalid boundary #{boundary} supplied" unless InRangeQuery.valid_boundaries.include?(boundary)
    end

    @include_boundaries = include_boundaries
  end

  def all
    start_condition = "#{start_column_string} #{include_boundaries.include?(:start) ? '<=' : '<'} ?"
    end_condition = "#{end_column_string} #{include_boundaries.include?(:end) ? '>=' : '>'} ?"
    relation.where("(#{start_condition}) AND (#{end_condition})", end_value, start_value)
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

  def self.valid_boundaries
    [:start, :end]
  end

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
