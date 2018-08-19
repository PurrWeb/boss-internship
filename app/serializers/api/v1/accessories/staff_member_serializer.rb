class Api::V1::Accessories::StaffMemberSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :fullName

  def fullName
    object.full_name
  end
end
