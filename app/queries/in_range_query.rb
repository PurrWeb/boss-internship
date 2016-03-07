class InRangeQuery
  def initialize(relation:, start_value:, end_value:, start_column_name: 'starts_at', end_column_name: 'ends_at', include_boundaries: true)
    @relation = relation
    @start_value = start_value
    @end_value = end_value
    @start_column_name = start_column_name
    @end_column_name = end_column_name
    @include_boundaries = include_boundaries
  end

  def all
    if include_boundaries
      relation.where("(? <= `#{end_column_name}`) AND (? >= `#{start_column_name}`)", start_value, end_value)
    else
      relation.where("(? < `#{end_column_name}`) AND (? > `#{start_column_name}`)", start_value, end_value)
    end
  end

  private
  attr_reader \
    :relation,
    :start_value,
    :end_value,
    :start_column_name,
    :end_column_name,
    :include_boundaries
end
