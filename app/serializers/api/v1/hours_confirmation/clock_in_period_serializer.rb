class Api::V1::HoursConfirmation::ClockInPeriodSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :startsAt,
    :endsAt,
    :staffMember,
    :venue,
    :date,
    :clockInBreaks,
    :clockInNotes,
    :clockInEvents,
    :status

  def status
    object.current_clock_in_state
  end

  def startsAt
    object.starts_at
  end

  def endsAt
    object.ends_at
  end

  def staffMember
    object.staff_member.id
  end

  def venue
    object.venue.id
  end

  def clockInBreaks
    object.clock_in_breaks.map(&:id)
  end

  def clockInNotes
    object.clock_in_notes.map(&:id)
  end

  def clockInEvents
    object.clock_in_events.map(&:id)
  end

  def date
    UIRotaDate.format(object.date)
  end
end
