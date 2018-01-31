class Api::V1::AccessoryRequests::AccessoryRequestSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :size,
    :staffMemberId,
    :accessoryId,
    :status

  def staffMemberId
    object.staff_member.id
  end

  def accessoryId
    object.accessory.id
  end
end
