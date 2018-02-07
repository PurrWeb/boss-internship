class Api::V1::StaffMemberProfile::AccessorySerializer < ActiveModel::Serializer
  attributes \
    :id,
    :name,
    :accessoryType,
    :size

  def accessoryType
    object.accessory_type
  end
end
