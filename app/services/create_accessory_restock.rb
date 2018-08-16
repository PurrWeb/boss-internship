class CreateAccessoryRestock
  Result = Struct.new(:success, :accessory_restock) do
    def success?
      success
    end
  end

  def initialize(params:)
    @params = params
  end

  def call
    success = false
    accessory_restock = nil

    accessory_restock = AccessoryRestock.new(params)
    success = accessory_restock.save

    Result.new(success, accessory_restock)
  end

  private
  attr_reader :params
end
