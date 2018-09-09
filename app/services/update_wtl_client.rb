class UpdateWtlClient
  Result = Struct.new(:success, :wtl_client) do
    def success?
      success
    end
  end

  def initialize(wtl_client:, requester:)
    @wtl_client = wtl_client
    @requester = requester
  end

  def call(params:)
    old_card = wtl_client.wtl_card
    new_card = params.fetch(:wtl_card)
    card_number_changed = wtl_client.wtl_card != params.fetch(:wtl_card)
    success = false
    success = wtl_client.update(params)
    if success
      if card_number_changed
        AssignWtlCard.new(wtl_card: new_card, wtl_client: wtl_client, user: requester).call if new_card.present?
        UnAssignWtlCard.new(wtl_card: old_card, user: requester).call if new_card.blank?
      end
    end
    Result.new(success, wtl_client)
  end

  private

  attr_reader :wtl_client, :requester
end
