class Api::V1::StaffMemberProfile::PermissionsSerializer < ActiveModel::Serializer
  attributes :canEnable, :holidaysTab, :owedHoursTab, :accessoriesTab

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
end
