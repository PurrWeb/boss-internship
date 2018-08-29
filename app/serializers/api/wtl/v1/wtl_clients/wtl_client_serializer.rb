class Api::Wtl::V1::WtlClients::WtlClientSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :firstName,
    :surname,
    :gender,
    :email,
    :dateOfBirth,
    :university,
    :cardNumber

  def firstName
    object.first_name
  end

  def dateOfBirth
    UIRotaDate.format(object.date_of_birth)
  end

  def cardNumber
    object.wtl_card.andand.number
  end
end
