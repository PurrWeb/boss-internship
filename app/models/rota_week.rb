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

  def each(&block)
    (start_date..end_date).each(&block)
  end

  def each_with_day(&block)
    each do |date|
      day = case date
      when start_date
        :monday
      when start_date + 1.days
        :tuesday
      when start_date + 2.days
        :wednesday
      when start_date + 3.days
        :thursday
      when start_date + 4.days
        :friday
      when start_date + 5.days
        :saturday
      when start_date + 6.days
        :sunday
      else
        raise 'unexpected date encountered'
      end

      block.call(date, day)
    end
  end

  def week_status
    current_week = RotaWeek.new(Time.current)
    if self > current_week
      :future
    elsif self == current_week
      :current
    else
      :past
    end
  end

  private
  attr_reader :supplied_date, :day_index
end
