class Api::V1::AccessoryRequests::PermissionsSerializer < ActiveModel::Serializer
  attributes :accessoryRequests, :accessoryRefundRequests

  def accessoryRequests
    object.accessory_requests
  end

  def accessoryRefundRequests
    object.accessory_refund_requests
  end
end
