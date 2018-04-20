class Api::V1::StaffMemberProfile::PermissionsSerializer < ActiveModel::Serializer
  attributes :canEnable, :holidaysTab

  def canEnable
    object.can_enable?
  end

  def holidaysTab
    object.holidays_tab
  end
end
