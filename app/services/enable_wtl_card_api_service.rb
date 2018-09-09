class EnableWtlCardApiService
  Result = Struct.new(:wtl_card, :success, :api_errors) do
    def success?
      success
    end
  end

  def initialize(wtl_card:)
    @wtl_card = wtl_card
  end

  def call
    wtl_card_result = EnableWtlCard.new(wtl_card: wtl_card).call

    api_errors = nil

    unless wtl_card_result.success?
      api_errors = WtlCardApiErrors.new(wtl_card: wtl_card_result.wtl_card)
    end

    Result.new(wtl_card_result.wtl_card, wtl_card_result.success?, api_errors)
  end

  private

  attr_reader :wtl_card
end
