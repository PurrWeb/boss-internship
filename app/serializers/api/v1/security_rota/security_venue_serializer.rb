class Api::V1::SecurityRota::SecurityVenueSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :name,
    :type

    def type
      "security"
    end
end
