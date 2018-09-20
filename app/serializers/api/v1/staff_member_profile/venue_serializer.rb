class Api::V1::StaffMemberProfile::VenueSerializer < ActiveModel::Serializer

  attributes \
    :id,
    :name,
    :rollbar_guid,
    :type

  def rollbarGuid
    object.rollbar_guid
  end

  def type
    object.venue_type
  end
end
