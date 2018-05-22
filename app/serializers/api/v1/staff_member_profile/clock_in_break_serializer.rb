class Api::V1::StaffMemberProfile::ClockInBreakSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :clockInPeriodId,
    :startsAt,
    :endsAt

  def clockInPeriodId
    object.clock_in_period_id
  end

  def startsAt
    object.starts_at.iso8601
  end

  def endsAt
    object.ends_at.iso8601
  end
end
