class AssignWtlCard
  Result = Struct.new(:success, :wtl_cards_history) do
    def success?
      success
    end
  end

  def initialize(wtl_card:, wtl_client:, user:)
    @wtl_card = wtl_card
    @wtl_client = wtl_client
    @user = user
  end

  def call
    success = false
    wtl_cards_history = nil

    wtl_cards_history = WtlCardsHistory.new(wtl_card: wtl_card, wtl_client: wtl_client, user: user)
    success = wtl_cards_history.save

    Result.new(success, wtl_cards_history)
  end

  private

  attr_reader :wtl_card, :wtl_client, :user
end
