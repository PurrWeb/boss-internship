class Api::V1::RotaShiftSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attributes :id, :url, :rota, :shift_type, :starts_at, :ends_at, :staff_member

  def url
    api_v1_rota_shift_url(object)
  end

  def rota
    {
      id: object.rota_id,
      url: api_v1_rota_url(object.rota)
    }
  end

  def starts_at
    object.starts_at.utc.iso8601
  end

  def ends_at
    object.ends_at.utc.iso8601
  end

  def staff_member
    {
      id: object.staff_member_id,
      url: api_v1_rota_url(object.staff_member)
    }
  end
end
