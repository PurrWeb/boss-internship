class Api::SecurityApp::V1::VenueSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :name,
    :venueType,

    def venueType
      object.venue_type
    end
end
