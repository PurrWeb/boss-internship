class CompleteAccessoryRequest
  Result = Struct.new(:success, :accessory_request) do
    def success?
      success
    end
  end

  def initialize(accessory_request:, requester:)
    @accessory_request = accessory_request
    @requester = requester
  end

  def call
    complete_success = false
    restock_success = false
    accessory = accessory_request.accessory
    last_count = accessory.accessory_restocks.last.andand.count || 0
    delta = -1
    current_count = last_count + delta

    ActiveRecord::Base.transaction do
      complete_success = accessory_request.transition_to!(:completed, requster_user_id: requester.id)

      restock_params = {
        accessory: accessory,
        count: current_count,
        delta: delta,
        created_by_user: requester,
        accessory_request: accessory_request
      }

      accessory_restock_result = CreateAccessoryRestock.new(params: restock_params).call

      raise ActiveRecord::Rollback unless complete_success && accessory_restock_result.success?
    end

    Result.new(complete_success && accessory_restock_result.success?, accessory_request)
  end

  private
  attr_reader :accessory_request, :requester
end
