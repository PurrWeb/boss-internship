class Api::V1::RotaDaily::RotaSerializer < ActiveModel::Serializer
  attributes :id, :venue, :date, :status

  def venue
    object.venue_id
  end

  def date
    UIRotaDate.format(object.date)
  end
end
