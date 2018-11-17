class Api::V1::AccessoryRequests::AccessoryRefundRequestSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :size,
    :staffMemberId,
    :accessoryId,
    :status,
    :frozen,
    :reusable

  def size
    object.accessory_request.size
  end

  def staffMemberId
    object.staff_member_id
  end

  def status
    object.current_state
  end

  def accessoryId
    object.accessory_request.accessory_id
  end

  def frozen
    !!object.boss_frozen?
  end
end
