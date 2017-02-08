class HolidayThisYearQuery
  def initialize(relation: Holiday.all, now: Time.zone.now)
    @relation = relation
    @today = now.to_date
  end

  def all
    tax_year = TaxYear.new(today)

    HolidayInRangeQuery.new(
      relation: relation,
      start_date: tax_year.start_date,
      end_date: tax_year.end_date
    ).all
  end

  def count
    all.count
  end

  private
  attr_reader :relation, :today
end
