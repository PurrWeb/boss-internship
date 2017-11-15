class Api::V1::VenueSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attributes :id, :url, :name, :rollbar_guid, :latitude, :longitude

  def url
    api_v1_venue_url(object)
  end
end
