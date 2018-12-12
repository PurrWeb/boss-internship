class Api::V1::StaffVettings::OffenderHistorySerializer < ActiveModel::Serializer
  attributes \
    :staffMemberId,
    :dodgedMinutes,
    :weekStart

  def staffMemberId
    object.staff_member_id
  end

  def dodgedMinutes
    object.minutes
  end

  def weekStart
    UIRotaDate.format(object.week_start)
  end
end
