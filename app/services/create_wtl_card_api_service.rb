class CreateWtlCardApiService
  Result = Struct.new(:wtl_card, :success, :api_errors) do
    def success?
      success
    end
  end

  def initialize(params:)
    @params = params
  end

  def call
    wtl_card_params = {
      number: params.fetch(:number),
    }

    wtl_card_result = CreateWtlCard.new(
      params: wtl_card_params,
    ).call

    api_errors = nil

    unless wtl_card_result.success?
      api_errors = WtlCardApiErrors.new(wtl_card: wtl_card_result.wtl_card)
    end

    Result.new(wtl_card_result.wtl_card, wtl_card_result.success?, api_errors)
  end

  private

  attr_reader :params
end
