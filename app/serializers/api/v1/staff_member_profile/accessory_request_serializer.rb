class Api::V1::StaffMemberProfile::AccessoryRequestSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :createdAt,
    :updatedAt,
    :status,
    :accessoryName,
    :size,
    :hasRefundRequest,
    :refundRequestStatus,
    :timeline,
    :frozen

  def updatedAt
    last_refund_state_change = if object.has_refund_request?
      refund_request = object.accessory_refund_request
      refund_request.current_state == "pending" \
        ? refund_request.created_at \
        : refund_request.last_transition.created_at
    end
    last_request_state_change = object.current_state == "pending" \
      ? object.created_at \
      : object.last_transition.created_at
    [last_refund_state_change, last_request_state_change].compact.max.utc
  end

  def createdAt
    object.created_at.utc
  end

  def status
    object.current_state
  end

  def accessoryName
    object.accessory.name
  end

  def timeline
    AccessoryRequestTimeline.new(accessory_request: object).serialize
  end

  def hasRefundRequest
    object.has_refund_request?
  end

  def refundRequestStatus
    object.accessory_refund_request.current_state if object.has_refund_request?
  end

  def frozen
    object.frozen?
  end
end
