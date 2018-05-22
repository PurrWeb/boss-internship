class Api::V1::StaffMemberProfile::ClockInEventSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :clockInPeriodId,
    :at,
    :eventType,
    :role

  def clockInPeriodId
    object.clock_in_period_id
  end

  def eventType
    object.event_type
  end

  def at
    object.at.iso8601
  end
end
