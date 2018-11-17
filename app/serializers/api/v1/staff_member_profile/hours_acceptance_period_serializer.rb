class Api::V1::StaffMemberProfile::HoursAcceptancePeriodSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :startsAt,
    :endsAt,
    :status,
    :hoursAcceptanceBreaksIds,
    :reasonNote,
    :date,
    :staffMemberId,
    :acceptedAt,
    :acceptedBy,
    :frozen,
    :venueId

  def acceptedAt
    object.accepted_at
  end

  def acceptedBy
    object.accepted_by.andand.full_name
  end

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

  def staffMemberId
    object.staff_member.id
  end

  def frozen
    object.boss_frozen?
  end

  def venueId
    object.venue.id
  end

  def hoursAcceptanceBreaksIds
    object.hours_acceptance_breaks_enabled.map(&:id)
  end
end
