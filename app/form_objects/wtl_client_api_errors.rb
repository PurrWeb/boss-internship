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
      if wtl_client.wtl_card.present?
        existing_client = WtlClient.where(wtl_card: wtl_client.wtl_card).first
        if wtl_client.wtl_card.disabled?
          @response_status = 403
          return {
                   headline: "Something went wrong!",
                   descirption: "We couldn't register you because of an issue with your email address or card.",
                 }
        end
        if existing_client.present?
          @response_status = 403
          if existing_client.email == wtl_client.email
            if existing_client.verified?
              return {
                       headline: "Already registered!",
                       descirption: "You are already registered. Your card is ready to use.",
                     }
            else
              return {
                       headline: "Already registered!",
                       descirption: "You are already registered. Verify your email address by visting the link in your verification email to complete the process and use your card.",
                     }
            end
          end
          return {
                   headline: "Card or email problem!",
                   descirption: "There was a problem with your email address or card number.",
                 }
        end
      else
        if card_number.present?
          @response_status = 403
          return {
                   headline: "Card or email problem!",
                   descirption: "This card could not be registered because there was a problem with your card or email address.",
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
