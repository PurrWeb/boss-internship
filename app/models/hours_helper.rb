class HoursHelper
  def initialize(total_minutes:)
    @total_minutes = Integer(total_minutes)
  end
  attr_reader :total_minutes

  def hours
   (total_minutes / 60).floor
  end

  def minutes
   (total_minutes % 60).floor
  end

  def description
    parts = []
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

  def self.from_hours_and_minutes(hours:, minutes:)
    total_minutes = (Integer(hours) * 60) + Integer(minutes)
    self.new(total_minutes: total_minutes)
  end
end
