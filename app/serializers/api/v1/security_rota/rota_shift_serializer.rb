class Api::V1::SecurityRota::RotaShiftSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :rota,
    :startsAt,
    :endsAt,
    :staffMemberId,
    :shiftType,
    :venueType

  def rota
    object.rota.id
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

  def staffMemberId
    object.staff_member.id
  end

  def venueType
    "normal"
  end
end
