class Api::V1::SecurityShiftRequests::RotaSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :venueId,
    :date,

  def venueId
    object.venue_id
  end

  def date
    UIRotaDate.format(object.date)
  end
end
