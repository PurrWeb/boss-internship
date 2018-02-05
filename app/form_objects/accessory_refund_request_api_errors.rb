class AccessoryRefundRequestApiErrors
  def initialize(accessory_refund_request:)
    @accessory_refund_request = accessory_refund_request
  end
  attr_reader :accessory_refund_request

  def errors
    result = {}
    result[:base] = accessory_refund_request.errors[:base] if accessory_refund_request.errors[:base].present?
    result[:accessoryRequest] = accessory_refund_request.errors[:accessory_request] if accessory_refund_request.errors[:accessory_request].present?
    result
  end
end
