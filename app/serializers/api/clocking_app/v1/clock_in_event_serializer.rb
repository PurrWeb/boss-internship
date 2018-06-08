class Api::ClockingApp::V1::ClockInEventSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :staffMemberId,
    :eventType

  def staffMemberId
    object.clock_in_period.clock_in_day.staff_member_id
  end

  def eventType
    object.event_type
  end
end