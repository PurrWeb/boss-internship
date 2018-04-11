class Api::V1::StaffMemberProfile::PermissionsSerializer < ActiveModel::Serializer
  attributes :canEnable

  def canEnable
    object.can_enable?
  end
end
