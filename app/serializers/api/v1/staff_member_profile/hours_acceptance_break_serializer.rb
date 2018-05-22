class Api::V1::StaffMemberProfile::HoursAcceptanceBreakSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :startsAt,
    :endsAt,
    :hoursAcceptancePeriodId

  def startsAt
    object.starts_at.iso8601
  end

  def endsAt
    object.ends_at.iso8601
  end

  def hoursAcceptancePeriodId
    object.hours_acceptance_period_id
  end
end
