class AccessoryRequestApiErrors
  def initialize(accessory_request:)
    @accessory_request = accessory_request
  end
  attr_reader :accessory_request

  def errors
    result = {}
    result[:base] = accessory_request.errors[:base] if accessory_request.errors[:base].present?
    result[:priceCents] = accessory_request.errors[:price_cents] if accessory_request.errors[:price_cents].present?
    result[:size] = accessory_request.errors[:size] if accessory_request.errors[:size].present?
    result[:accessoryType] = accessory_request.errors[:accessory_type] if accessory_request.errors[:accessory_type].present?
    result[:accessoryId] = accessory_request.errors[:accessory] if accessory_request.errors[:accessory].present?
    result[:staffMember] = accessory_request.errors[:staff_member] if accessory_request.errors[:staff_member].present?

    result
  end
end
