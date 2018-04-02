class Api::V1::SecurityRota::StaffMemberSerializer < ActiveModel::Serializer

  attributes :id, :avatarUrl, :firstName, :surname, :preferredHours,
             :preferredDays

  def avatarUrl
    object.avatar_url
  end

  def firstName
    object.name.first_name
  end

  def surname
    object.name.surname
  end

  def preferredHours
    object.hours_preference_note
  end

  def preferredDays
    object.day_perference_note
  end
end
