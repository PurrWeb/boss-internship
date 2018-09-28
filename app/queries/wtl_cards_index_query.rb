class WtlCardsIndexQuery
  def initialize(filter:)
    @filter = filter
  end

  def all
    wtl_cards = WtlCard.includes([versions: [:item]]).all
    card_number = filter[:card_number]

    if card_number.present?
      wtl_cards = wtl_cards.search(number)
    end
    wtl_cards
  end

  private
  attr_reader :filter
end
