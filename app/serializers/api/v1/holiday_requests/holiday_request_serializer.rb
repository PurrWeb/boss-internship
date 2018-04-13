class Api::V1::HolidayRequests::HolidayRequestSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :startDate,
    :endDate,
    :state,
    :createdAt,
    :holidayType,
    :creator,
    :note,
    :staffMemberId

  def startDate
    UIRotaDate.format(object.start_date)
  end

  def endDate
    UIRotaDate.format(object.end_date)
  end

  def createdAt
    object.created_at
  end

  def holidayType
    object.holiday_type
  end

  def state
    object.current_state
  end

  def creator
    object.creator.full_name
  end

  def staffMemberId
    object.staff_member_id
  end
end
