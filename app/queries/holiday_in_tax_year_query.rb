class HolidayInTaxYearQuery
  def initialize(relation: Holiday.all, tax_year:)
    @relation = relation
    @tax_year = tax_year
  end

  def all
    HolidayInRangeQuery.new(
      relation: relation,
      start_date: tax_year.start_date,
      end_date: tax_year.end_date
    ).all
  end

  def day_count
    all.to_a.sum { |holiday| holiday.days }
  end

  private
  attr_reader :relation, :tax_year
end