class Api::V1::StaffMemberProfile::AccessoryRequestSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :createdAt,
    :status,
    :accessoryName,
    :size

  def createdAt
    object.created_at.utc
  end

  def accessoryName
    object.accessory.name
  end
end
