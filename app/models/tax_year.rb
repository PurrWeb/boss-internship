class TaxYear
  def initialize(date)
    @date = date
  end
  attr_reader :date

  def year
    start_date.year
  end

  def self.last_tax_year
    current_tax_year = TaxYear.new(Time.current)

    for_year(current_tax_year.year - 1)
  end

  def self.deadline_for_year(year)
    Date.new(year, 4, 9)
  end

  def self.for_year(year)
    new(deadline_for_year(year) + 1.week)
  end

  def start_date
    if before_current_calendar_year_tax_deadline?
      last_calendar_year_tax_deadline
    else
      calendar_year_tax_deadline
    end
  end

  def end_date
    if before_current_calendar_year_tax_deadline?
      calendar_year_tax_deadline
    else
      next_calendar_year_tax_deadline
    end
  end

  def contains_date?(date)
    date >= start_date && date <= end_date
  end

  def rota_start_time
    RotaShiftDate.new(start_date).start_time
  end

  def rota_end_time
    RotaShiftDate.new(end_date).end_time
  end

  def before_current_calendar_year_tax_deadline?
    date < calendar_year_tax_deadline
  end

  def calendar_year_tax_deadline
    TaxYear.deadline_for_year(date.year)
  end

  def next_calendar_year_tax_deadline
    calendar_year_tax_deadline + 1.year
  end

  def last_calendar_year_tax_deadline
    calendar_year_tax_deadline - 1.year
  end
end
