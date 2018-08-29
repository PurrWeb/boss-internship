class Api::V1::WtlCards::WtlCardSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :number,
    :disabled

  def disabled
    object.disabled?
  end
end
