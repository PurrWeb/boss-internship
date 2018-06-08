class Api::ClockingApp::V1::StaffTypeSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :name,
    :color,

  def color
    '#' + object.ui_color
  end
end