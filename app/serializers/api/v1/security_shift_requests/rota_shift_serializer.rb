class Api::V1::SecurityShiftRequests::RotaShiftSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :rotaId,
    :startsAt,
    :endsAt,
    :staffMemberId,
    :venueId

  def rotaId
    object.rota_id
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

  def staffMemberId
    object.staff_member.id
  end
end
