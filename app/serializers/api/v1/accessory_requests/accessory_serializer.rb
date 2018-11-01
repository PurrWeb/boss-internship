class Api::V1::AccessoryRequests::AccessorySerializer < ActiveModel::Serializer
  attributes \
    :id,
    :name,
    :accessoryType,
    :size,
    :priceCents,
    :userRequestable,
    :enabled,
    :freeItems

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

  def freeItems
    object.accessory_restocks.last.andand.count || 0
  end
end
