class RotaShiftDate
  def initialize(date)
    if date.is_a?(Time)
      @rota_date = RotaShiftDate.to_rota_date(date)
    else
      @rota_date = date
    end
  end

  def start_time
    rota_date.beginning_of_day + 8.hours
  end

  def end_time
    (rota_date + 1.day).beginning_of_day + 8.hours
  end

  def contains_time?(time)
    time >= start_time && time <= end_time
  end

  attr_reader :rota_date

  def self.to_rota_date(time)
    calendar_date = time.to_date
    if time < (time.beginning_of_day + 8.hours)
      calendar_date - 1.day
    else
      calendar_date
    end
  end
end
