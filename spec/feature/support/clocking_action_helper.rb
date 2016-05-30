class ClockingActionHelper
  def self.create_initial_clock_in(clock_in_day:, at:, creator:)
    clock_in_period = ClockInPeriod.create!(
      clock_in_day: clock_in_day,
      starts_at: at,
      creator: creator
    )

    ClockInEvent.create!(
      clock_in_period: clock_in_period,
      at: at,
      creator: creator,
      event_type: 'clock_in'
    )
  end

  def self.add_event_to_period(clock_in_period:, event_type:, creator:, at:)
    ClockInEvent.create!(
      clock_in_period: clock_in_period,
      at: at,
      creator: creator,
      event_type: event_type
    )
  end
end
