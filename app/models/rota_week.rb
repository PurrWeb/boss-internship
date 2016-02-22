class RotaWeek
  include Comparable

  def initialize(date)
    @supplied_date = date.to_date
  end

  def start_date
    supplied_date.monday
  end

  def end_date
    supplied_date.sunday
  end

  def ==(other)
    self.class === other &&
      start_date == other.start_date &&
      end_date == other.end_date
  end

  def eql?(other)
    self.==(other)
  end

  def hash
    [self.class.name, start_date.to_s, end_date.to_s].hash
  end

  def <=>(other)
    start_date <=> other.start_date
  end

  private
  attr_reader :supplied_date, :day_index
end
