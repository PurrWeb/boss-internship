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
      refund_request.transition_to(:pending, requster_user_id: requester.id, type: "request")
      refund_request
    else
      AccessoryRefundRequest.new(params)
    end
    success = accessory_refund_request.save

    Result.new(success, accessory_refund_request)
  end

  private
  attr_reader :params, :requester
end
