class Api::V1::SecurityRota::HolidaySerializer < ActiveModel::Serializer
  attributes :id, :startDate, :endDate, :holidayType, :status,
             :days, :staffMemberId
  def startDate
    UIRotaDate.format(object.start_date)
  end

  def endDate
    UIRotaDate.format(object.end_date)
  end

  def status
    object.current_state
  end

  def staffMemberId
    object.staff_member_id
  end

  def holidayType
    object.holiday_type
  end
end
