class Api::V1::HoursConfirmation::StaffMemberSerializer < ActiveModel::Serializer

  attributes \
    :id,
    :staffType,
    :fullName,
    :avatarUrl,
    :venues

  def staffType
    object.staff_type.id
  end

  def fullName
    object.full_name
  end

  def venues
    object.workable_venues.map(&:id)
  end

  def avatarUrl
    object.avatar_url
  end
end
