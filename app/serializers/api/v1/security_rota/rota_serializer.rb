class Api::V1::SecurityRota::RotaSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attributes :id, :venue, :date, :status

  def venue
    object.venue_id
  end

  def date
    UIRotaDate.format(object.date)
  end
end
