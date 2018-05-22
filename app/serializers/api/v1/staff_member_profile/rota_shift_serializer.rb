class Api::V1::StaffMemberProfile::RotaShiftSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :staffMemberId,
    :venueId,
    :date,
    :shiftType,
    :startsAt,
    :endsAt

  def staffMemberId
    object.staff_member_id
  end

  def venueId
    object.rota.venue_id
  end

  def date
    UIRotaDate.format(object.rota.date)
  end

  def shiftType
    object.shift_type
  end

  def startsAt
    object.starts_at.utc.iso8601
  end

  def endsAt
    object.ends_at.utc.iso8601
  end
end
