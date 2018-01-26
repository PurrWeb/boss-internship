class AccessoryRefundRequestApiErrors
  def initialize(accessory_refund_request:)
    @accessory_refund_request = accessory_refund_request
  end
  attr_reader :accessory_refund_request

  def errors
    result = {}
    result[:accessoryRequest] = accessory_refund_request.errors[:accessory_request] if accessory_refund_request.errors[:accessory_request].present?
    result
  end
end
