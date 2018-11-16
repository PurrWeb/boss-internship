class RefundAccessoryRequest
  Result = Struct.new(:success, :accessory_refund_request) do
    def success?
      success
    end
  end

  def initialize(params:, requester:)
    @params = params
    @requester = requester
  end

  def call
    success = false
    accessory_requests = params.fetch(:accessory_request)
    refund_request = accessory_requests.accessory_refund_request
    refund_request_rejected = refund_request.present? && refund_request.current_state == "rejected"

    accessory_refund_request = if refund_request_rejected
      if refund_request.boss_frozen?
        refund_request.errors.add(:base, "can't refund accessory request that has been frozen")
        success = false
      else
        success = refund_request.transition_to(:pending, requster_user_id: requester.id)
      end
      refund_request
    else
      refund_request = AccessoryRefundRequest.new(params)
      success = refund_request.save
      refund_request
    end
    Result.new(success, accessory_refund_request)
  end

  private
  attr_reader :params, :requester
end
