class Api::V1::VenueForSelectSerializer < ActiveModel::Serializer
  attributes :id, :value, :label

  def value
    object.name
  end

  def label
    value.capitalize
  end
end
