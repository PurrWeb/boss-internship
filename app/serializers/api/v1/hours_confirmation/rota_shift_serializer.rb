class Api::V1::HoursConfirmation::RotaShiftSerializer < ActiveModel::Serializer
  attributes :id, :rota, :shiftType, :startsAt, :endsAt, :staffMember

  def shiftType
    object.shift_type
  end

  def rota
    object.rota.id
  end

  def startsAt
    object.starts_at.utc.iso8601
  end

  def endsAt
    object.ends_at.utc.iso8601
  end

  def staffMember
    object.staff_member.id
  end
end
