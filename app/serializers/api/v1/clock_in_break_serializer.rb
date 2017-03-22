class Api::V1::ClockInBreakSerializer < ActiveModel::Serializer
  attributes :id, :clock_in_period, :starts_at, :ends_at

  def clock_in_period
    { id: object.clock_in_period_id }
  end

  def starts_at
    object.starts_at.iso8601
  end

  def ends_at
    object.ends_at.iso8601
  end
end
