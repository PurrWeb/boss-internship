class Api::V1::HoursConfirmation::RotaSerializer < ActiveModel::Serializer
  attributes :id, :venue, :date, :status

  def venue
    object.venue.id
  end

  def date
    UIRotaDate.format(object.date)
  end
end
