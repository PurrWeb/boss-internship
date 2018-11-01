class Api::V1::Accessories::AccessoryRestockSerializer < ActiveModel::Serializer
  attributes \
    :accessoryId,
    :createdByUser,
    :createdAt,
    :assignedToStaffMemberId,
    :count,
    :delta

  def accessoryId
    object.accessory_id
  end

  def createdByUser
    object.created_by_user.full_name
  end

  def createdAt
    object.created_at
  end

  def assignedToStaffMemberId
    object.accessory_request.staff_member_id if object.accessory_request.present?
  end
end
