class Api::V1::SecurityRota::StaffTypeSerializer < ActiveModel::Serializer
  attributes :id, :name, :color

  def color
    '#' + object.ui_color
  end
end
