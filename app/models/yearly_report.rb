class YearlyReport
  def initialize(staff_member:, tax_year:)
    @staff_member = staff_member
    @tax_year = tax_year
    @week_data = default_week_data
    @total_hours_count = 0
  end
  attr_reader :staff_member, :tax_year
  attr_accessor :total_cents, :owed_hours_count, :holiday_days_count

  def self.years
    start_tax_year = 2016
    current_tax_year = TaxYear.new(Time.current).year
    if current_tax_year == start_tax_year
      [current_tax_year]
    else
      start_tax_year..current_tax_year
    end
  end

  def total_hours_count
    @total_hours_count
  end

  def dates
    @week_data.map {|key, value| key }
  end

  def hours_count(rota_week:)
    @week_data.fetch(rota_week.start_date).fetch(:hours_count)
  end

  def add_hours(rota_week:, payable_hours:)
    @total_hours_count += payable_hours
    @week_data.fetch(rota_week.start_date)[:hours_count] += payable_hours
  end

  def default_week_data
    result = {}

    week_pointer_date = tax_year.start_date
    week_index = 0
    while week_pointer_date < tax_year.end_date
      week = RotaWeek.new(week_pointer_date)
      result[week.start_date] = {
        index: week_index,
        hours_count: 0
      }

      week_pointer_date = week_pointer_date + 1.week
      week_index = week_index + 1
    end

    result
  end
end
