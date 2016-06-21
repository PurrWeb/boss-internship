class OwedHoursInWeekQuery
  def initialize(relation:, week:)
    @relation = relation
    @week = week
  end
  attr_reader :relation, :week

  def all
    relation.
      where(
        week_start_date: week.start_date,
      )
  end
end
