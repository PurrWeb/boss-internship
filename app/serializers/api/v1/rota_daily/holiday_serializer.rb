class Api::V1::RotaDaily::HolidaySerializer < ActiveModel::Serializer
  attributes :id, :start_date, :end_date, :holiday_type, :status,
             :days, :staff_member
  def start_date
    UIRotaDate.format(object.start_date)
  end

  def end_date
    UIRotaDate.format(object.end_date)
  end

  def status
    object.current_state
  end

  def staff_member
    {
      id: object.staff_member_id,
    }
  end
end
