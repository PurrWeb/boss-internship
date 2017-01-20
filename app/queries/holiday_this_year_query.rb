class HolidayThisYearQuery
  def initialize(relation: Holiday.all, now: Time.zone.now)
    @relation = relation
    @today = now.to_date
  end

  def all
    HolidayInRangeQuery.new(
      relation: relation,
      start_date: start_date,
      end_date: end_date,
    ).all
  end

  def past_current_year_start?
    today > this_holiday_year_start
  end

  def this_holiday_year_start
    today.beginning_of_year + 3.months
  end

  def start_date
    if past_current_year_start?
      this_holiday_year_start
    else
      this_holiday_year_start - 1.year
    end
  end

  def end_date
    if past_current_year_start?
      this_holiday_year_start + 1.year
    else
      this_holiday_year_start
    end
  end

  private
  attr_reader :relation, :today
end
