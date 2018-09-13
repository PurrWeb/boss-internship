class UpdateWtlClientApiService
  Result = Struct.new(:wtl_client, :success, :api_errors) do
    def success?
      success
    end
  end

  def initialize(wtl_client:, requester:)
    @wtl_client = wtl_client
    @requester = requester
  end

  def call(params:)
    wtl_card = WtlCard.find_by(number: params.fetch(:cardNumber))

    wtl_client_params = {
      first_name: params.fetch(:firstName),
      surname: params.fetch(:surname),
      gender: params.fetch(:gender),
      email: params.fetch(:email),
      date_of_birth: UIRotaDate.safe_parse(params.fetch(:dateOfBirth)),
      university: params.fetch(:university),
      phone_number: params.fetch(:phoneNumber),
      wtl_card: wtl_card,
    }
    wtl_client.from_registration = false
    wtl_client_result = UpdateWtlClient.new(wtl_client: wtl_client, requester: requester).call(params: wtl_client_params)

    api_errors = nil

    unless wtl_client_result.success?
      wtl_client = wtl_client_result.wtl_client
      if wtl_client.wtl_card.blank? && params.fetch(:cardNumber).present?
        wtl_client.errors.add(:wtl_card, "Card doesn't exist")
      end
      api_errors = WtlClientApiErrors.new(wtl_client: wtl_client_result.wtl_client)
    end

    Result.new(wtl_client_result.wtl_client, wtl_client_result.success?, api_errors)
  end

  private

  attr_reader :wtl_client, :requester
end
