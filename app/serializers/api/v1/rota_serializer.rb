class Api::V1::RotaSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attributes :id, :url, :venue, :date, :status

  def url
    api_v1_rota_url(object) if object.persisted?
  end

  def venue
    {
      id: object.venue_id,
      url: api_v1_venue_url(object.venue)
    }
  end

  def date
    object.date.iso8601
  end
end
