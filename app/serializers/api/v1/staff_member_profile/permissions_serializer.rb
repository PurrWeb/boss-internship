class Api::V1::StaffMemberProfile::PermissionsSerializer < ActiveModel::Serializer
  attributes :canEnable, :canForceRetakeAvatar, :holidaysTab, :owedHoursTab, :accessoriesTab, :disciplinariesTab

  def canForceRetakeAvatar
    object.can_force_retake_avatar?
  end

  def canEnable
    object.can_enable?
  end

  def holidaysTab
    object.holidays_tab
  end

  def owedHoursTab
    object.owed_hours_tab
  end

  def accessoriesTab
    object.accessories_tab
  end

  def disciplinariesTab
    object.disciplinaries_tab
  end
end
