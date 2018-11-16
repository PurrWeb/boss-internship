class Api::V1::RotaShifts::RotaShiftSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :rota,
    :shift_type,
    :starts_at,
    :ends_at,
    :staff_member

  def rota
    object.rota_id
  end

  def starts_at
    object.starts_at.utc.iso8601
  end

  def ends_at
    object.ends_at.utc.iso8601
  end

  def staff_member
    object.staff_member_id
  end
end
