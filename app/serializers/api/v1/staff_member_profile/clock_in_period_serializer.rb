class Api::V1::StaffMemberProfile::ClockInPeriodSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :startsAt,
    :endsAt,
    :staffMemberId,
    :venueId,
    :date,
    :clockInBreaksIds,
    :clockInNotesIds,
    :clockInEventsIds,
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

  def staffMemberId
    object.staff_member.id
  end

  def venueId
    object.venue.id
  end

  def clockInBreaksIds
    object.clock_in_breaks.map(&:id)
  end

  def clockInNotesIds
    object.clock_in_notes.map(&:id)
  end

  def clockInEventsIds
    object.clock_in_events.map(&:id)
  end

  def date
    UIRotaDate.format(object.date)
  end
end
