class Api::ClockingApp::V1::ClockInPeriodSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :staffMemberId,
    :startsAt,
    :endsAt,
    :clockInEvents

  def staffMemberId
    object.clock_in_day.staff_member_id
  end

  def startsAt
    object.starts_at
  end

  def endsAt
    object.ends_at
  end

  def clockInEvents
    object.clock_in_events.map(&:id)
  end
end