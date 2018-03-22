class Api::V1::HoursConfirmation::ClockInEventSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :clockInPeriod,
    :at,
    :eventType,
    :role

  def clockInPeriod
    object.clock_in_period.id
  end

  def eventType
    object.event_type
  end

  def at
    object.at.iso8601
  end
end
