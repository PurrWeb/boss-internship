class CreateWtlClientApiService
  Result = Struct.new(:wtl_client, :success, :api_errors) do
    def success?
      success
    end
  end

  def initialize(params:)
    @params = params
  end

  def call
    wtl_card = WtlCard.find_by(number: params.fetch(:card_number))

    wtl_client_params = {
      first_name: params.fetch(:first_name),
      surname: params.fetch(:surname),
      gender: params.fetch(:gender),
      email: params.fetch(:email),
      date_of_birth: params[:date_of_birth].present? ? UIRotaDate.parse(params.fetch(:date_of_birth)) : nil,
      university: params.fetch(:university),
      phone_number: params.fetch(:phone_number),
      wtl_card: wtl_card,
    }

    wtl_client_result = CreateWtlClient.new(
      params: wtl_client_params,
    ).call

    api_errors = nil

    unless wtl_client_result.success?
      wtl_client = wtl_client_result.wtl_client
      if wtl_client.wtl_card.blank? && params.fetch(:card_number).present?
        wtl_client.errors.add(:wtl_card, "Card doesn't exist")
      end

      api_errors = WtlClientApiErrors.new(wtl_client: wtl_client, card_number: params.fetch(:card_number))
    end

    Result.new(wtl_client_result.wtl_client, wtl_client_result.success?, api_errors)
  end

  private

  attr_reader :params
end
