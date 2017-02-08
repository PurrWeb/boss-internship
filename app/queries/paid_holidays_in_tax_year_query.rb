class PaidHolidaysInTaxYearQuery
  def initialize(staff_member:, date:)
    @staff_member = staff_member
    @date = date
  end
  attr_reader :staff_member, :date

  def all
    holiday_relation = Holiday.
      paid.
      in_state(:enabled).
      where(staff_member: staff_member)

    tax_year = TaxYear.new(date)

    HolidayInRangeQuery.new(
      relation: holiday_relation,
      start_value: tax_year.start_date,
      end_value: tax_year.end_date
    ).all
  end

  def count
    all.count
  end
end
