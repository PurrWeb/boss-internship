class Api::V1::StaffMemberProfile::AccessoryRequestSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :createdAt,
    :status,
    :accessoryName,
    :size,
    :hasRefundRequest

  def createdAt
    object.updated_at.utc
  end

  def status
    object.current_state
  end

  def accessoryName
    object.accessory.name
  end

  def hasRefundRequest
    object.in_state(:accepted) && object.accessory_refund_request.present?
  end

  def requestTimeLine

  end
end
