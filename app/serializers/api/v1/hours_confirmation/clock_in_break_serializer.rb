class Api::V1::HoursConfirmation::ClockInBreakSerializer < ActiveModel::Serializer
  attributes :id, :clockInPeriod, :startsAt, :endsAt

  def clockInPeriod
    object.clock_in_period.id
  end

  def startsAt
    object.starts_at.iso8601
  end

  def endsAt
    object.ends_at.iso8601
  end
end
