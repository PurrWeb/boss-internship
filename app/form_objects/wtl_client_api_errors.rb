class WtlClientApiErrors
  def initialize(wtl_client:)
    @wtl_client = wtl_client
  end

  attr_reader :wtl_client

  def errors
    result = {}
    result[:base] = wtl_client.errors[:base] if wtl_client.errors[:base].present?
    result[:firstName] = wtl_client.errors[:first_name] if wtl_client.errors[:first_name].present?
    result[:surname] = wtl_client.errors[:surname] if wtl_client.errors[:surname].present?
    result[:gender] = wtl_client.errors[:gender] if wtl_client.errors[:gender].present?
    result[:email] = wtl_client.errors[:email] if wtl_client.errors[:email].present?
    result[:dateOfBirth] = wtl_client.errors[:date_of_birth] if wtl_client.errors[:date_of_birth].present?
    result[:university] = wtl_client.errors[:university] if wtl_client.errors[:university].present?
    result[:cardNumber] = wtl_client.errors[:card_number] if wtl_client.errors[:card_number].present?
    if wtl_client.errors[:wtl_card].present?
      result[:cardNumber] ||= []
      result[:cardNumber] << wtl_client.errors[:wtl_card]
    end

    result
  end
end
