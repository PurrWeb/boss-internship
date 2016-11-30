class HoursHelper
  def self.hours_from_total_minutes(total_minutes)
   (total_minutes / 60).floor
  end

  def self.hour_minutes_from_total_minutes(total_minutes)
   (total_minutes % 60).floor
  end

  def self.hour_and_minute_text(total_minutes)
    parts = []
    hours = hours_from_total_minutes(total_minutes)
    minutes = hour_minutes_from_total_minutes(total_minutes)

    if hours > 0
      parts << "#{hours} Hours"
      if minutes > 0
        parts << " and "
      end
    end

    if minutes > 0
      parts << "#{minutes} Minutes"
    end

    parts.join(" ")
  end

  def self.total_minutes_from_hours_and_minutes(hours:, minutes:)
    (Integer(hours) * 60) + Integer(minutes)
  end
end
