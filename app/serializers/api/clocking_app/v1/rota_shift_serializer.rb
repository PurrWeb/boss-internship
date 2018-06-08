class Api::ClockingApp::V1::RotaShiftSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :staffMemberId,
    :venueId,
    :startsAt,
    :endsAt

  def staffMemberId
    object.staff_member_id
  end

  def venueId
    object.rota.venue_id
  end

  def startsAt
    object.starts_at.utc.iso8601
  end

  def endsAt
    object.ends_at.utc.iso8601
  end
end
