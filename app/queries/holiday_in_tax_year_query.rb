class HolidayInTaxYearQuery
  def initialize(relation: Holiday.all, staff_member_start_date: nil, tax_year:)
    @relation = relation
    @tax_year = tax_year
    @staff_member_start_date = staff_member_start_date
  end

  def start_date
    if staff_member_start_date.present?
      [staff_member_start_date, tax_year.start_date].max
    else
      tax_year.start_date
    end
  end

  def all
    HolidayInRangeQuery.new(
      relation: relation,
      start_date: start_date,
      end_date: tax_year.end_date
    ).all
  end

  def day_count
    all.to_a.sum { |holiday| holiday.days }
  end

  private
  attr_reader :relation, :tax_year, :staff_member_start_date
end
