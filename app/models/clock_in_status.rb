class ClockInStatus
  STATES = [:clocked_in, :clocked_out, :on_break]

  def initialize(clock_in_day:)
    @clock_in_day = clock_in_day
    @date = clock_in_day.date
    @venue = clock_in_day.venue
    @staff_member = clock_in_day.staff_member
  end
  attr_reader :clock_in_day, :date, :venue, :staff_member

  def current_state
    clock_in_day.current_clock_in_state
  end

  def transition_to!(state:, at:, requester:, nested: false)
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

    ActiveRecord::Base.transaction(requires_new: nested) do
      saved_last_event = last_event

      event_type = event_type_for_transition(from: current_state, to: state)
      current_recorded_clock_in_period = CurrentRecordedClockInPeriodQuery.
        new(
          clock_in_day: clock_in_day
        ).
        first

      if !current_recorded_clock_in_period.present?
        current_recorded_clock_in_period = ClockInPeriod.new(
          creator: requester,
          clock_in_day: clock_in_day,
          starts_at: at,
          clock_in_period_reason: nil
        )
      elsif event_type == 'clock_out'
        current_recorded_clock_in_period.update_attributes!(ends_at: at)
        create_hours_confirmation_from_clock_in_period(
          clock_in_period: current_recorded_clock_in_period,
          creator: requester
        )
      elsif event_type == 'end_break'
        new_break = ClockInBreak.create!(
          clock_in_period: current_recorded_clock_in_period,
          starts_at: saved_last_event.at,
          ends_at: at
        )
        current_recorded_clock_in_period.clock_in_breaks << new_break
      end

      current_recorded_clock_in_period.save!

      ClockInEvent.create!(
        clock_in_period: current_recorded_clock_in_period,
        at: at,
        creator: requester,
        event_type: event_type
      )
    end
  end

  private
 def create_hours_confirmation_from_clock_in_period(clock_in_period:, creator:)
   clock_in_day = clock_in_period.clock_in_day

   hours_acceptance_period = HoursAcceptancePeriod.create!(
     starts_at: clock_in_period.starts_at,
     ends_at: clock_in_period.ends_at,
     clock_in_day: clock_in_day,
     creator: creator
   )

   clock_in_period.clock_in_breaks.each do |_break|
     hours_acceptance_break = HoursAcceptanceBreak.create!(
       hours_acceptance_period: hours_acceptance_period,
       starts_at: _break.starts_at,
       ends_at: _break.ends_at
     )

     hours_acceptance_period.hours_acceptance_breaks << hours_acceptance_break
   end
 end

  def last_event
    events.last
  end

  def events
    ClockInEvent.
      joins(:clock_in_period).
      merge(
        ClockInPeriod.
        joins(:clock_in_day).
        merge(
          ClockInDay.where(id: clock_in_day.id)
        )
      ).
      order(:at)
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
