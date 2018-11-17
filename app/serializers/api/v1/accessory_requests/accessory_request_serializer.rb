class Api::V1::AccessoryRequests::AccessoryRequestSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :size,
    :staffMemberId,
    :accessoryId,
    :status,
    :frozen

  def staffMemberId
    object.staff_member.id
  end

  def status
    object.current_state
  end

  def accessoryId
    object.accessory.id
  end

  def frozen
    object.boss_frozen?
  end
end
