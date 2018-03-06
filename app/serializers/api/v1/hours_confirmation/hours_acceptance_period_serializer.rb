class Api::V1::HoursConfirmation::HoursAcceptancePeriodSerializer < ActiveModel::Serializer
  attributes :id, :startsAt, :endsAt, :status,
             :hoursAcceptanceBreaks, :reasonNote, :date, :staffMember

  def startsAt
    object.starts_at.iso8601
  end

  def endsAt
    object.ends_at.iso8601
  end

  def reasonNote
    object.reason_note
  end

  def date
    UIRotaDate.format(object.date)
  end

  def staffMember
    object.staff_member.id
  end

  def hoursAcceptanceBreaks
    object.hours_acceptance_breaks_enabled.map(&:id)
  end
end
