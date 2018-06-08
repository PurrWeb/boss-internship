class Api::ClockingApp::V1::ClockInNoteSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :note,
    :staffMemberId,
    :creatorFullName,
    :createdAt

  def staffMemberId
    object.staff_member.id
  end

  def creatorFullName
    object.creator.full_name
  end

  def createdAt
    object.created_at
  end
end
