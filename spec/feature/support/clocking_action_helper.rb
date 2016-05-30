class ClockingActionHelper
  def self.create_initial_clock_in(clock_in_day:, at:, creator:)
    clock_in_period = ClockInPeriod.create!(
      clock_in_day: clock_in_day,
      starts_at: at,
      creator: creator
    )

    event = ClockingEvent.create!(
      venue: clock_in_day.venue,
      staff_member: clock_in_day.staff_member,
      at: at,
      creator: creator,
      event_type: 'clock_in'
    )

    clock_in_period.clocking_events << event
  end

  def self.add_event_to_period(clock_in_period:, event_type:, creator:, at:)
    event = ClockingEvent.create!(
      venue: clock_in_period.venue,
      staff_member: clock_in_period.staff_member,
      at: at,
      creator: creator,
      event_type: event_type
    )

    clock_in_period.clocking_events << event
  end
end
