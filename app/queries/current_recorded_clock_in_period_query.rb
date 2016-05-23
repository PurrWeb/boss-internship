class CurrentRecordedClockInPeriodQuery
  def initialize(clock_in_day:)
    @clock_in_day = clock_in_day
  end

  def first
    ClockInPeriod.
      where(
        clock_in_day: clock_in_day,
        ends_at: nil
      ).
      first
  end

  private
  attr_reader :clock_in_day
end
