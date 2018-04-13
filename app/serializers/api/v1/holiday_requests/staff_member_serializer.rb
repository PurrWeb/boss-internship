class Api::V1::HolidayRequests::StaffMemberSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :fullName,
    :avatarUrl,
    :venueId,

  def venueId
    object.master_venue_id
  end

  def fullName
    object.full_name
  end

  def avatarUrl
    object.avatar_url
  end
end
