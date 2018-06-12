class Api::V1::SecurityRota::SecurityVenueShiftSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :securityVenueId,
    :startsAt,
    :endsAt,
    :staffMemberId,
    :venueType

  def securityVenueId
    object.security_venue_id
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

  def venueType
    "security"
  end
end
