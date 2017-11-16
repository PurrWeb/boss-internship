class Api::V1::Holidays::HolidaySerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  
  attributes \
    :id,
    :url,
    :start_date,
    :end_date,
    :holiday_type,
    :status,
    :note,
    :days,
    :staff_member,
    :created_by,
    :created_at

  def url
    api_v1_holiday_url(object)
  end

  def created_at
    object.created_at.iso8601
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
      url: api_v1_staff_member_url(object.staff_member),
    }
  end

  def created_by
    object.creator.full_name
  end
end
