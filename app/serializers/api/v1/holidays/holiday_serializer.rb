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
    :created_at,
    :payslip_date

  def url
    api_v1_holiday_url(object)
  end

  def created_at
    object.created_at.iso8601
  end

  def start_date
    #TODO: should be in UIRotaDate format
    object.start_date.iso8601
  end

  def end_date
    #TODO: Should be in UIRotaDate format
    object.end_date.iso8601
  end

  def payslip_date
    UIRotaDate.format(object.payslip_date)
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
