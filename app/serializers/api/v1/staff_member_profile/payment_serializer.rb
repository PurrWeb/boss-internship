class Api::V1::StaffMemberProfile::PaymentSerializer < ActiveModel::Serializer
  attributes :id, :processDate, :weekStartDate, :weekEndDate, :cents, :createdByUserName, :staffMemberId, :status, :isLate, :receivedAt

  def staffMemberId
    object.staff_member.id
  end

  def status
    object.current_state
  end

  def processDate
    UIRotaDate.format(object.date)
  end

  def weekStartDate
    UIRotaDate.format(RotaWeek.new(object.date).start_date)
  end

  def weekEndDate
    UIRotaDate.format(RotaWeek.new(object.date).end_date)
  end

  def createdByUserName
    object.created_by_user.name
  end

  def receivedAt
    object.received_at && object.received_at.utc.iso8601
  end

  def isLate
    object.current_state == 'pending' &&
      (RotaWeek.new(object.date).end_date < (Time.current - 2.weeks))
  end
end
