class AccessoryRequestTimeline
  def initialize(accessory_request:)
    @accessory_request = accessory_request
  end

  def serialize
    requests_timeline = accessory_request.state_machine
      .history.map {|from_history| request_entry(request_history: from_history, request_type: "accessoryRequest")}

    requests_timeline_with_initial = [{
      requester: requester_entry(id: accessory_request.created_by_user.id),
      createdAt: accessory_request.created_at,
      state: AccessoryRequest.initial_state,
      type: "request",
      requestType: "accessoryRequest"
    }] + requests_timeline

    refund_requests_timeline_with_initial = if accessory_request.has_refund_request?
      refund_request = accessory_request.accessory_refund_request
      refund_requests_timeline = refund_request.state_machine
        .history.map {|from_history| request_entry(request_history: from_history, request_type: "refundRequest")}

      [{
        requester: requester_entry(id: refund_request.created_by_user.id),
        createdAt: refund_request.created_at,
        state: AccessoryRefundRequest.initial_state,
        type: "request",
        requestType: "refundRequest"
      }] + refund_requests_timeline
    end
    (requests_timeline_with_initial + (refund_requests_timeline_with_initial || [])).compact
  end

  private
  def requester_entry(id:)
    requester = User.includes(:name).find_by(id: id)
    return nil unless requester.present?
    {
      id: requester.id,
      fullName: requester.full_name
    }
  end

  def request_entry(request_history:, request_type:)
    {
      requester: requester_entry(id: request_history.metadata["requster_user_id"]),
      createdAt: request_history.created_at,
      state: request_history.to_state,
      type: request_history.metadata["type"],
      requestType: request_type
    }
  end

  attr_reader :accessory_request
end