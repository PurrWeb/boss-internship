class Api::V1::SimpleUserSerializer < ActiveModel::Serializer
  attributes :id, :fullName

  def fullName
    object.full_name
  end
end
