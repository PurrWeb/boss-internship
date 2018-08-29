class Api::V1::WtlCards::WtlClientSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :fullName,
    :cardNumber

  def fullName
    object.full_name
  end

  def cardNumber
    object.card_number
  end
end
