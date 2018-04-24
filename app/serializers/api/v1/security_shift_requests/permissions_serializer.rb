class Api::V1::SecurityShiftRequests::PermissionsSerializer < ActiveModel::Serializer
  attributes \
    :shiftRequests

  def shiftRequests
    object.shift_requests
  end
end
