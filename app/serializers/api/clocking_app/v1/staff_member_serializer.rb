class Api::ClockingApp::V1::StaffMemberSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :firstName,
    :surname,
    :staffTypeId,
    :avatarUrl,
    :markedRetakeAvatar

  def firstName
    object.andand.name.first_name
  end

  def surname
    object.andand.name.surname
  end

  def staffTypeId
    object.staff_type_id
  end

  def avatarUrl
    object.avatar_url
  end

  def markedRetakeAvatar
    object.marked_retake_avatar?
  end
end