class WtlClientApiErrors
  def initialize(wtl_client:, card_number: nil)
    @wtl_client = wtl_client
    @card_number = card_number
    @response_status = 422
  end

  attr_reader :wtl_client, :card_number
  attr_accessor :response_status

  def errors
    if wtl_client.from_registration?
      if wtl_client.wtl_card.blank? && card_number.present?
        @response_status = 403
        return {
                 headline: "Card or email problem!",
                 descirption: "This card could not be registered because there was a problem with your card or email address.",
               }
      end
      if wtl_client.email.present? && WtlClient.where(email: wtl_client.email).present?
        @response_status = 403
        return {
                 headline: "Already registered!",
                 descirption: "It seems like you are already registered with this Email.",
               }
      end
      if wtl_client.wtl_card.present?
        if wtl_client.wtl_card.disabled?
          @response_status = 403
          return {
                   headline: "Card disabled!",
                   descirption: "It seems like your card is disabled.",
                 }
        end
        if WtlClient.where(wtl_card: wtl_client.wtl_card).present?
          @response_status = 403
          return {
                   headline: "Already registered!",
                   descirption: "It seems like you are already registered with this card number",
                 }
        end
      end
    end

    result = {}
    result[:base] = wtl_client.errors[:base] if wtl_client.errors[:base].present?
    result[:firstName] = wtl_client.errors[:first_name] if wtl_client.errors[:first_name].present?
    result[:surname] = wtl_client.errors[:surname] if wtl_client.errors[:surname].present?
    result[:gender] = wtl_client.errors[:gender] if wtl_client.errors[:gender].present?
    result[:email] = wtl_client.errors[:email] if wtl_client.errors[:email].present?
    result[:dateOfBirth] = wtl_client.errors[:date_of_birth] if wtl_client.errors[:date_of_birth].present?
    result[:university] = wtl_client.errors[:university] if wtl_client.errors[:university].present?
    result[:cardNumber] = wtl_client.errors[:wtl_card] if wtl_client.errors[:wtl_card].present?

    result
  end
end
