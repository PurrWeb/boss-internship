class Api::V1::WtlCards::WtlCardSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :number,
    :disabled,
    :history

  def disabled
    object.disabled?
  end

  def history
    WtlCardHistoryService.new(wtl_card: object).call
  end
end
