class Api::V1::StaffMemberProfile::PermissionsSerializer < ActiveModel::Serializer
  attributes :canEnable, :holidays, :holiday_requests

  def canEnable
    object.can_enable?
  end

  def holidays
    object.holidays
  end

  def holiday_requests
    object.holiday_requests
  end
end
