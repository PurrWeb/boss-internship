class Api::V1::ClockingWebApp::StaffMemberSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attributes :id, :url, :avatar_url, :staff_type, :first_name, :surname, :preferred_hours,
             :preferred_days, :venues, :isOnHolidays

  def url
    api_v1_staff_member_url(object)
  end

  def staff_type
    {
      id: object.staff_type_id,
      url: api_v1_staff_type_url(object.staff_type),
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

  def isOnHolidays
    staff_with_holidays_ids = instance_options.fetch(:scope).fetch(:staff_with_holidays_ids)
    staff_with_holidays_ids.include?(object.id)
  end

  def venues
    object.workable_venues.map do |venue|
      {
        id: venue.id,
        url: api_v1_venue_url(venue),
      }
    end
  end
end
