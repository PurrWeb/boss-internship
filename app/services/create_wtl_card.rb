class CreateWtlCard
  Result = Struct.new(:success, :wtl_card) do
    def success?
      success
    end
  end

  def initialize(params:)
    @params = params
  end

  def call
    success = false
    wtl_card = nil

    wtl_card = WtlCard.new(params)
    success = wtl_card.save

    Result.new(success, wtl_card)
  end

  private

  attr_reader :params
end
