class Api::SecurityApp::V1::SecurityVenueShiftSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :staffMemberId,
    :venueId,
    :date,
    :startsAt,
    :endsAt

  def staffMemberId
    object.staff_member_id
  end

  def venueId
    object.security_venue_id
  end

  def date
    UIRotaDate.format(object.date)
  end

  def startsAt
    object.starts_at.utc.iso8601
  end

  def endsAt
    object.ends_at.utc.iso8601
  end
end
