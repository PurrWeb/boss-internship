class Api::V1::StaffMemberProfile::StaffTypeSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attributes :id, :name, :color

  def color
    '#' + object.ui_color
  end
end
