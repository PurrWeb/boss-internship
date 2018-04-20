class Api::V1::HolidayRequests::PermissionsSerializer < ActiveModel::Serializer
  attributes :holidayRequests

  def holidayRequests
    object.holiday_requests
  end
end
