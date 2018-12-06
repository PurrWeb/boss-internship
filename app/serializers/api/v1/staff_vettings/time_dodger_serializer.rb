class Api::V1::StaffVettings::TimeDodgerSerializer < ActiveModel::Serializer
  attributes \
    :staffMemberId,
    :acceptedHours,
    :paidHolidays,
    :owedHours,
    :acceptedBreaks,
    :minutes,
    :weekStart

  def staffMemberId
    object.staff_member_id
  end

  def acceptedHours
    object.accepted_hours
  end

  def paidHolidays
    object.paid_holidays
  end

  def owedHours
    object.owed_hours
  end

  def acceptedBreaks
    object.accepted_breaks
  end

  def weekStart
    UIRotaDate.format(object.week_start)
  end
end
