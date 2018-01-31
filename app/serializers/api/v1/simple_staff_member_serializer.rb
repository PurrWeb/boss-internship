class Api::V1::SimpleStaffMemberSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :avatarUrl,
    :fullName,

  def avatarUrl
    object.avatar_url
  end

  def fullName
    object.full_name
  end
end
