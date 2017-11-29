class Api::SecurityApp::V1::RotaStaffMemberSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :firstName,
    :surname,
    :avatarImageUrl,
    :preferredHoursNote,
    :preferredDaysNote

  def firstName
    object.name.first_name
  end

  def surname
    object.name.surname
  end

  def avatarImageUrl
    object.avatar_url
  end

  def preferredHoursNote
    object.hours_preference_note
  end

  def preferredDaysNote
    object.day_perference_note
  end
end
