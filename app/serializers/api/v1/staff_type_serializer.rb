class Api::V1::StaffTypeSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attributes :id, :url, :name, :color

  def url
    api_v1_staff_type_url(object)
  end

  def color
    '#' + object.ui_color
  end
end
