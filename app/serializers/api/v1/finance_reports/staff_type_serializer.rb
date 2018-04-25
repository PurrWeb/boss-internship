class Api::V1::FinanceReports::StaffTypeSerializer < ActiveModel::Serializer
  attributes :id, :name, :color

  def color
    '#' + object.ui_color
  end
end
