class MondayTaxYear
  def initialize(date)
    @tax_year = TaxYear.new(date)
  end

  attr_reader :tax_year

  def start_date
    if tax_year.start_date.monday?
      tax_year.start_date
    else
      tax_year.start_date.next_week(:monday)
    end
  end

  def end_date
    if tax_year.end_date.monday?
      tax_year.end_date
    else
      tax_year.end_date.end_of_week
    end
  end

  def contains_date?(date)
    date >= start_date && date <= end_date
  end
end
