class Api::V1::Holidays::StaffMemberSearchSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  
    attributes \
      :id,
      :url,
      :avatar_url,
      :staff_type,
      :first_name,
      :surname,
      :preferred_hours,
      :preferred_days,
      :master_venue
  
    def url
      api_v1_staff_member_url(object)
    end
  
    def staff_type
      {
        id: object.staff_type_id,
        url: api_v1_staff_type_url(object.staff_type)
      }
    end
  
    def first_name
      object.name.first_name
    end
  
    def surname
      object.name.surname
    end
  
    def preferred_hours
      object.hours_preference_note
    end
  
    def preferred_days
      object.day_perference_note
    end
  
    def master_venue
      {
        id: object.master_venue.andand.id,
        url: object.master_venue && api_v1_venue_url(object.master_venue)
      }
    end
end
