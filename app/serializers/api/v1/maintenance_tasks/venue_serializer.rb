class Api::V1::MaintenanceTasks::VenueSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attributes :id, :url, :name, :rollbarGuid, :latitude, :longitude

  def url
    api_v1_venue_url(object)
  end

  def rollbarGuid
    object.rollbar_guid
  end
end
