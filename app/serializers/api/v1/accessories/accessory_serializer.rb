class Api::V1::Accessories::AccessorySerializer < ActiveModel::Serializer
  attributes \
    :id,
    :name,
    :accessory_type,
    :size,
    :price_cents,
    :user_requestable,
    :enabled,
    :pending_request_count,
    :pending_refund_count

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

  def pending_request_count
    object.accessory_requests.in_state(:pending).count
  end

  def pending_refund_count
    AccessoryRefundRequest.in_state(:pending).where(
      accessory_request: object.accessory_requests
    ).count
  end
end
