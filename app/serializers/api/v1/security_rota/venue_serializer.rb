class Api::V1::SecurityRota::VenueSerializer < ActiveModel::Serializer

  attributes :id, :name, :rollbar_guid

  def rollbarGuid
    object.rollbar_guid
  end
end
