class Api::V1::UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :role

  def name
    object.name.first_name + ' ' + object.name.surname
  end
end
