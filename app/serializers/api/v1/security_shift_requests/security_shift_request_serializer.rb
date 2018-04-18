class Api::V1::SecurityShiftRequests::SecurityShiftRequestSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :venueId,
    :startsAt,
    :endsAt,
    :createdShiftId,
    :status,
    :note

  def venueId
    object.venue_id
  end

  def startsAt
    object.starts_at.utc.iso8601
  end

  def endsAt
    object.ends_at.utc.iso8601
  end

  def createdShiftId
    object.created_shift_id
  end

  def status
    object.current_state
  end
end
