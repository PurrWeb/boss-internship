class TaxYear
  def initialize(date)
    @date = date
  end
  attr_reader :date

  def start_date
    if before_current_calendar_year_tax_deadline?
      last_calendar_year_tax_dealine
    else
      current_calendar_year_tax_dealine
    end
  end

  def end_date
    if before_current_calendar_year_tax_deadline?
      current_calendar_year_tax_dealine
    else
      next_calendar_year_tax_deadline
    end
  end

  def before_current_calendar_year_tax_deadline?
    date < current_calendar_year_tax_dealine
  end

  def current_calendar_year_tax_dealine
    Date.new(date.year, 4, 5)
  end

  def next_calendar_year_tax_deadline
    current_calendar_year_tax_dealine + 1.year
  end

  def last_calendar_year_tax_dealine
    current_calendar_year_tax_dealine - 1.year
  end
end
