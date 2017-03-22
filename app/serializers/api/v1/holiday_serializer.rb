class Api::V1::HolidaySerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attributes :id, :url, :start_date, :end_date, :holiday_type, :status,
             :days, :staff_member

  def url
    api_v1_holiday_url(object)
  end

  def start_date
    object.start_date.iso8601
  end

  def end_date
    object.end_date.iso8601
  end

  def status
    object.current_state
  end

  def staff_member
    {
      id: object.staff_member_id,
      url: api_v1_staff_member_url(object.staff_member)
    }
  end
end
