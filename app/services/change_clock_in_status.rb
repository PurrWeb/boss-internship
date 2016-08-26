class ChangeClockInStatus
  class Result < Struct.new(:success, :clock_in_day, :errors)
    def success?
      success
    end
  end

  STATES = [:clocked_in, :clocked_out, :on_break]

  def initialize(date:, venue:, staff_member:, requester:, state:, at:, nested: false)
    @date = date
    @venue = venue
    @staff_member = staff_member
    @requester = requester
    @state = state
    @at = at
    @nested = nested
  end
  attr_reader :date, :venue, :staff_member, :requester, :state, :at, :nested

  def call
    errors = {}

    clock_in_day = ClockInDay.find_or_initialize_by(
      venue: venue,
      date: date,
      staff_member: staff_member
    )

    raise "unsupported state encountered: #{state}" unless STATES.include?(state)
    if !RotaShiftDate.new(date).contains_time?(at)
      errors[:base] ||= []
      raise "at time on wrong day. at: #{at}, date: #{date}"
    end
    if last_event(clock_in_day) && (at < last_event(clock_in_day).at)
      raise 'supplied at time before previous event'
    end


    transition_legal = allowed_event_transations.fetch(clock_in_day.current_clock_in_state).any? do |transition_data|
      transition_data.fetch(:state) == state
    end
    if !transition_legal
      errors[:base] ||= []
      errors[:base] << "illegal attempt to transistion from #{clock_in_day.current_clock_in_state} to #{state}"
    end

    result = transition_legal

    if transition_legal
      ActiveRecord::Base.transaction(requires_new: nested) do
        if clock_in_day.new_record?
          clock_in_day.update_attributes!(
            creator: requester
          )
        end

        saved_last_event = last_event(clock_in_day)

        event_type = event_type_for_transition(from: clock_in_day.current_clock_in_state, to: state)
        current_recorded_clock_in_period = CurrentRecordedClockInPeriodQuery.
          new(
            clock_in_day: clock_in_day
          ).
          first

        if !current_recorded_clock_in_period.present?
          current_recorded_clock_in_period = ClockInPeriod.new(
            creator: requester,
            clock_in_day: clock_in_day,
            starts_at: at
          )
        elsif event_type == 'clock_out'
          if saved_last_event.event_type == 'start_break'
            add_break_to_period(
              clock_in_period: current_recorded_clock_in_period,
              last_event: saved_last_event,
              at: at
            )
          end

          current_recorded_clock_in_period.update_attributes!(ends_at: at)

          overlap_query = OverlappingHoursAcceptancePeriodQuery.new(
            clock_in_day: clock_in_day,
            starts_at: current_recorded_clock_in_period.starts_at,
            ends_at: current_recorded_clock_in_period.ends_at
          )
          new_period_will_conflict_with_existing = overlap_query.count > 0

          if !new_period_will_conflict_with_existing
            create_hours_confirmation_from_clock_in_period(
              clock_in_period: current_recorded_clock_in_period,
              creator: requester
            )
          end
        elsif event_type == 'end_break'
          add_break_to_period(
            clock_in_period: current_recorded_clock_in_period,
            last_event: saved_last_event,
            at: at
          )
        end

        current_recorded_clock_in_period.save!

        ClockInEvent.create!(
          clock_in_period: current_recorded_clock_in_period,
          at: at,
          creator: requester,
          event_type: event_type
        )

        result = true
      end
    end

    Result.new(result, clock_in_day.reload, errors)
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

 def add_break_to_period(clock_in_period:, at:, last_event:)
    new_break = ClockInBreak.create!(
      clock_in_period: clock_in_period,
      starts_at: last_event.at,
      ends_at: at
    )
    clock_in_period.clock_in_breaks << new_break
 end

  def last_event(clock_in_day)
    events(clock_in_day).last
  end

  def events(clock_in_day)
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
        { state: :on_break,    transition_event: 'start_break' }
      ],
      clocked_out: [
        { state: :clocked_in, transition_event: 'clock_in' }
      ],
      on_break: [
        { state: :clocked_in,  transition_event: 'end_break' },
        { state: :clocked_out, transition_event: 'clock_out' }
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
