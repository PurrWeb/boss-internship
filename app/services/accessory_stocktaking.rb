class AccessoryStocktaking
  Result = Struct.new(:success, :accessory_restock) do
    def success?
      success
    end
  end

  def initialize(
    accessory:,
    count:,
    requester:
  )
    @accessory = accessory
    @count = count.to_i
    @requester = requester
  end

  def call
    success = false
    accessory_restock = nil

    last_count = accessory.accessory_restocks.last.andand.count || 0
    delta = count - last_count
    params = {
      accessory: accessory,
      count: count,
      delta: delta,
      created_by_user: requester
    }
    accessory_restock_result = CreateAccessoryRestock.new(params: params).call

    accessory_restock_result
  end

  private
  attr_reader :accessory, :count, :requester
end
