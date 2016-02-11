class RotaWeek
  def initialize(date)
    @supplied_date = date
  end

  def start_date
    supplied_date.monday
  end

  def end_date
    supplied_date.sunday
  end

  private
  attr_reader :supplied_date, :day_index
end
