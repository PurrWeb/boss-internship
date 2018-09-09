class DisableWtlCard
  Result = Struct.new(:success, :wtl_card) do
    def success?
      success
    end
  end

  def initialize(wtl_card:)
    @wtl_card = wtl_card
  end

  def call
    success = false
    success = wtl_card.disabled!
    Result.new(success, wtl_card)
  end

  private

  attr_reader :wtl_card
end
