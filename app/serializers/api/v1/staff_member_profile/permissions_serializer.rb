class Api::V1::StaffMemberProfile::PermissionsSerializer < ActiveModel::Serializer
  attributes :canEnable, :holidays, :holidayRequests

  def canEnable
    object.can_enable?
  end

  def holidays
    object.holidays
  end

  def holidayRequests
    object.holiday_requests
  end
end
