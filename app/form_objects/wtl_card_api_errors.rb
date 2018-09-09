class WtlCardApiErrors
  def initialize(wtl_card:)
    @wtl_card = wtl_card
  end

  attr_reader :wtl_card

  def errors
    result = {}
    result[:base] = wtl_card.errors[:base] if wtl_card.errors[:base].present?
    result[:number] = wtl_card.errors[:number] if wtl_card.errors[:number].present?

    result
  end
end
