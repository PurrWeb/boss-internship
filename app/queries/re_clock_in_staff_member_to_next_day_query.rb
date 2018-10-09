class ReClockInStaffMemberToNextDayQuery
  THRESHOLD_MINUTES = 30.minutes

  def initialize(threshold_minutes: ReClockInStaffMemberToNextDayQuery::THRESHOLD_MINUTES)
    @threshold_minutes = threshold_minutes
  end

  def all(date:)
    business_day_start = RotaShiftDate.new(date).start_time

    clock_in_periods_ids = ClockInPeriod
      .joins([:clock_in_day, :clock_in_events])
      .where(clock_in_days: {date: date - 1.day})
      .where(clock_in_events: {event_type: ["clock_in", "end_break", "start_break"]})
      .where(clock_in_periods: {starts_at: [business_day_start - threshold_minutes..business_day_start]})
      .group("clock_in_periods.id")
      .maximum("clock_in_events.id")
      .keys

    ClockInPeriod.where(id: clock_in_periods_ids)
  end

  private

  attr_reader :threshold_minutes
end
