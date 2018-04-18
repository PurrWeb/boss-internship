class Api::V1::SecurityRotaShiftRequests::StaffMemberSerializer < ActiveModel::Serializer

  attributes \
    :id,
    :avatarUrl,
    :firstName,
    :surname,
    :staffTypeId

  def avatarUrl
    object.avatar_url
  end

  def firstName
    object.name.first_name
  end

  def surname
    object.name.surname
  end

  def staffTypeId
    object.staff_type.id
  end
end
