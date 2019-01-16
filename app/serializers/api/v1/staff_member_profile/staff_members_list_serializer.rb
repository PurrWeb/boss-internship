class Api::V1::StaffMemberProfile::StaffMembersListSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

    attributes \
      :id,
      :url,
      :avatarUrl,
      :staffTypeId,
      :firstName,
      :surname,
      :masterVenueId

    def staffTypeId
      object.staff_type_id
    end

    def firstName
      object.name.first_name
    end

    def surname
      object.name.surname
    end

    def masterVenueId
      object.master_venue.andand.id
    end
end
