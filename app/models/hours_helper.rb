class HoursHelper
  def self.hours_from_total_minutes(total_minutes)
   (total_minutes / 60).floor
  end

  def self.hour_minutes_from_total_minutes(total_minutes)
   (total_minutes % 60).floor
  end

  def self.total_minutes_from_hours_and_minutes(hours:, minutes:)
    (hours * 60) + minutes
  end
end
