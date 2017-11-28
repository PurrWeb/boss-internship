class HolidaySerializer < ActiveModel::Serializer
  attributes \
    :id,
    :staffMemberId,
    :startDate,
    :endDate

  def staffMemberId
    object.staff_member_id
  end

  def startDate
    UIRotaDate.format(object.start_date)
  end

  def endDate
    UIRotaDate.format(object.end_date)
  end
end
