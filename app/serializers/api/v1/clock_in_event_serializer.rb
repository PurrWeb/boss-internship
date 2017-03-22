class Api::V1::ClockInEventSerializer < ActiveModel::Serializer
  attributes :id, :clock_in_period, :at, :event_type

  def clock_in_period
    { id: object.clock_in_period_id }
  end

  def at
    object.at.iso8601
  end
end
