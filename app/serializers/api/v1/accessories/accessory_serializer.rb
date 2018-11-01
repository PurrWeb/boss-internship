class Api::V1::Accessories::AccessorySerializer < ActiveModel::Serializer
  attributes \
    :id,
    :name,
    :accessoryType,
    :size,
    :priceCents,
    :userRequestable,
    :enabled,
    :pendingRequestCount,
    :pendingRefundCount,
    :booked,
    :refunded,
    :freeItems

  def freeItems
    object.accessory_restocks.last.andand.count || 0
  end

  def booked
    object.accessory_requests.in_state(:completed).count
  end

  def refunded
    AccessoryRefundRequest.in_state(:completed).where(
      accessory_request: object.accessory_requests
    ).count
  end

  def enabled
    object.enabled?
  end

  def accessoryType
    object.accessory_type
  end

  def priceCents
    object.price_cents
  end

  def userRequestable
    object.user_requestable
  end

  def pendingRequestCount
    object.accessory_requests.in_state(:pending).count
  end

  def pendingRefundCount
    AccessoryRefundRequest.in_state(:pending).where(
      accessory_request: object.accessory_requests
    ).count
  end
end
