class Api::V1::StaffMemberProfile::StaffMembersListSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

    attributes \
      :id,
      :avatarUrl,
      :staffTypeId,
      :firstName,
      :surname,
      :status,
      :masterVenueId

    def status
      object.state_machine.current_state
    end

    def avatarUrl
      object.avatar_url
    end

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
