class Api::V1::Accessories::AccessorySerializer < ActiveModel::Serializer
  attributes \
    :id,
    :name,
    :accessory_type,
    :size,
    :price_cents,
    :user_requestable,
    :enabled

  def enabled
    object.enabled?
  end
end
