class AccessoryRequestApiErrors
  def initialize(accessory_request:)
    @accessory_request = accessory_request
  end
  attr_reader :accessory_request

  def errors
    result = {}
    result[:base] = accessory_request.errors[:base] if accessory_request.errors[:base].present?
    result[:size] = accessory_request.errors[:size] if accessory_request.errors[:size].present?
    result[:accessoryId] = accessory_request.errors[:accessory] if accessory_request.errors[:accessory].present?

    result
  end
end
