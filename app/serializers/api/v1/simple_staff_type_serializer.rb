class Api::V1::SimpleStaffTypeSerializer < ActiveModel::Serializer
  attributes :id, :name, :color

  def color
    '#' + object.ui_color
  end
end
