class Api::V1::StaffMemberProfile::SecurityVenueSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :name,
    :type

    def type
      object.venue_type
    end
end
