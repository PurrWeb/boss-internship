class Api::V1::SecurityRota::VenueSerializer < ActiveModel::Serializer

  attributes \
    :id,
    :name,
    :rollbar_guid,
    :type

  def rollbarGuid
    object.rollbar_guid
  end

  def type
    "normal"
  end
end
