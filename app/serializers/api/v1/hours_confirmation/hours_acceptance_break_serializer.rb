class Api::V1::HoursConfirmation::HoursAcceptanceBreakSerializer < ActiveModel::Serializer
  attributes :id, :startsAt, :endsAt, :hoursAcceptancePeriod
  
  def startsAt
    object.starts_at.iso8601
  end

  def endsAt
    object.ends_at.iso8601
  end

  def hoursAcceptancePeriod
    object.hours_acceptance_period.id
  end
end
