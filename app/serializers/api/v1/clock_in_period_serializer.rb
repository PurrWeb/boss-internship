class Api::V1::ClockInPeriodSerializer < ActiveModel::Serializer
  attributes :id, :starts_at, :ends_at, :clock_in_day

  def clock_in_day
    { id: object.clock_in_day_id }
  end
end
