class Api::V1::WtlClients::WtlClientSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :firstName,
    :surname,
    :fullName,
    :gender,
    :email,
    :dateOfBirth,
    :university,
    :cardNumber,
    :emailVerified,
    :disabled,
    :updatedAt,
    :history

  def fullName
    object.full_name
  end

  def firstName
    object.first_name
  end

  def dateOfBirth
    UIRotaDate.format(object.date_of_birth)
  end

  def cardNumber
    object.card_number
  end

  def emailVerified
    object.verified?
  end

  def updatedAt
    object.updated_at
  end

  def disabled
    object.disabled?
  end

  def history
    WtlClientHistoryService.new(wtl_client: object).call
  end
end
