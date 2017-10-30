class Api::V1::RotaDaily::StaffMemberSerializer < ActiveModel::Serializer

  attributes :id, :avatar_url, :staff_type, :first_name, :surname, :preferred_hours,
             :preferred_days

  def staff_type
    object.staff_type.id
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
end
