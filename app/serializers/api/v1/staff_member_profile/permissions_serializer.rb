class Api::V1::StaffMemberProfile::PermissionsSerializer < ActiveModel::Serializer
  attributes :canEnable, :holidaysTab, :owedHoursTab

  def canEnable
    object.can_enable?
  end

  def holidaysTab
    object.holidays_tab
  end

  def owedHoursTab
    object.owed_hours_tab
  end
end
