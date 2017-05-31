class Api::V1::FlaggedStaffMemberSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attributes :id, :date_of_birth, :url, :avatar_url, :staff_type, :first_name, :surname, :preferred_hours,
             :preferred_days, :email_address, :disabled_by_user, :disabled_at, :disable_reason

  def url
    api_v1_staff_member_url(object)
  end

  def disable_reason
    object.disable_reason
  end

  def email_address
    object.email_address.email
  end

  def disabled_by_user
    object.disabled_by_user.full_name.titlecase
  end

  def disabled_at
    object.disabled_at.to_s(:human_date)
  end

  def staff_type
    object.staff_type.name.titlecase
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

  # def venues
  #   venues = StaffMemberWorkableVenuesQuery.new(
  #     staff_member: object
  #   ).all
  #
  #   venues.map do |venue|
  #     {
  #       id: venue.id,
  #       url: api_v1_venue_url(venue)
  #     }
  #   end
  # end

end
