class HolidayThisYearQuery
  def initialize(relation: Holiday.all, now: Time.zone.now)
    @relation = relation
    @today = now.to_date
  end

  def all
    HolidayInRangeQuery.new(
      relation: relation,
      start_date: this_holiday_year_start,
      end_date: next_holiday_year_start,
    ).all
  end

  def this_holiday_year_start
    today.beginning_of_year + 3.months
  end

  def next_holiday_year_start
    (today + 1.year).beginning_of_year + 3.months
  end

  private
  attr_reader :relation, :today
end
