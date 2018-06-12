class Api::V1::SecurityVenues::SecurityVenueSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :name,
    :address,
    :lat,
    :lng

end
