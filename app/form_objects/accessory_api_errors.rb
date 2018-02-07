class AccessoryApiErrors
  def initialize(accessory:)
    @accessory = accessory
  end
  attr_reader :accessory

  def errors
    result = {}
    result[:base] = accessory.errors[:base] if accessory.errors[:base].present?
    result[:priceCents] = accessory.errors[:price_cents] if accessory.errors[:price_cents].present?
    result[:size] = accessory.errors[:size] if accessory.errors[:size].present?
    result[:accessoryType] = accessory.errors[:accessory_type] if accessory.errors[:accessory_type].present?
    result[:name] = accessory.errors[:name] if accessory.errors[:name].present?

    result
  end
end
