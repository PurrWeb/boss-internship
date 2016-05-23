class ClockInStatus
  STATES = [:clocked_in, :clocked_out, :on_break]

  def initialize(staff_member:, venue:, date:)
    @staff_member = staff_member
    @venue = venue
    @date = date
  end

  attr_reader :staff_member

  def current_state
    case last_event.andand.event_type
    when 'clock_in'
      :clocked_in
    when 'clock_out'
      :clocked_out
    when 'start_break'
      :on_break
    when 'end_break'
      :clocked_out
    when nil
      :clocked_out
    else
      raise "Usupported event type encountered :#{last_event.event_type}"
    end
  end

  def transition_to!(state:, at:, requester:)
    raise "unsupported state encountered: #{state}" unless STATES.include?(state)

    transition_legal = allowed_event_transations.fetch(current_state).any? do |transition_data|
      transition_data.fetch(:state) == state
    end

    if !transition_legal
      raise "illegal attempt to transistion from #{current_state} to #{state}"
    end
    if !RotaShiftDate.new(date).contains_time?(at)
      raise "at time on wrong day. at: #{at}, date: #{date}"
    end
    if last_event && (at < last_event.at)
      raise 'supplied at time before previous event'
    end

    ActiveRecord::Base.transaction do
      saved_last_event = last_event

      new_event = ClockingEvent.create!(
        venue: venue,
        staff_member: staff_member,
        at: at,
        creator: requester,
        event_type: event_type_for_transition(from: current_state, to: state)
      )

      current_recorded_clock_in_period = CurrentRecordedClockInPeriodQuery.
        new(
          venue: venue,
          staff_member: staff_member
        ).
        first

      if !current_recorded_clock_in_period.present?
        current_recorded_clock_in_period = ClockInPeriod.new(
          creator: requester,
          venue: venue,
          date: date,
          staff_member: staff_member,
          starts_at: at,
          clock_in_period_reason: nil
        )
      elsif new_event.clock_out?
        current_recorded_clock_in_period.update_attributes!(ends_at: at)
      elsif new_event.end_break?
        new_break = ClockInBreak.create!(
          clock_in_period: current_recorded_clock_in_period,
          starts_at: saved_last_event.at,
          ends_at: at
        )
        current_recorded_clock_in_period.clock_in_breaks << new_break
      end
      current_recorded_clock_in_period.clocking_events << new_event

      current_recorded_clock_in_period.save!
    end
  end

  private
  attr_reader :venue, :date

  def interval_event?
    last_event.clock_in? || last_event.start_break?
  end

  def last_event
    events.last
  end

  def events
    staff_member_events = ClockingEvent.where(
      venue: venue,
      staff_member: staff_member
    )

    InRangeQuery.new(
      relation: staff_member_events,
      start_value: RotaShiftDate.new(date).start_time,
      end_value: RotaShiftDate.new(date).end_time,
      start_column_name: 'at',
      end_column_name: 'at'
    ).all.order(:at)
  end

  def allowed_event_transations
    {
      clocked_in: [
        { state: :clocked_out, transition_event: 'clock_out' },
        { state: :on_break, transition_event: 'start_break' }
      ],
      clocked_out: [
        { state: :clocked_in, transition_event: 'clock_in' }
      ],
      on_break: [
        { state: :clocked_in, transition_event: 'end_break' }
      ]
    }
  end

  def event_type_for_transition(from:, to:)
    allowed_event_transations.fetch(from).
      select do |transition_data|
        transition_data.fetch(:state) == to
      end.
      first.
      fetch(:transition_event)
  end
end
