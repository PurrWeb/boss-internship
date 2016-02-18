class InRangeQuery
  def initialize(relation:, start_value:, end_value:, start_column_name: 'starts_at', end_column_name: 'ends_at')
    @relation = relation
    @start_value = start_value
    @end_value = end_value
    @start_column_name = start_column_name
    @end_column_name = end_column_name
  end

  def all
    relation.where("(? <= `#{end_column_name}`) AND (? >= `#{start_column_name}`)", start_value, end_value)
  end

  private
  attr_reader \
    :relation,
    :start_value,
    :end_value,
    :start_column_name,
    :end_column_name
end
