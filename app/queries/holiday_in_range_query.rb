class HolidayInRangeQuery
  def initialize(relation: Holiday.all, start_date:, end_date:)
    @relation = relation
    @start_date = start_date
    @end_date = end_date
  end

  def all
    InRangeQuery.new(
      relation: relation,
      start_value: start_date,
      end_value: end_date,
      start_column_name: 'start_date',
      end_column_name: 'end_date'
    ).all
  end

  private
  attr_reader :relation, :start_date, :end_date
end
