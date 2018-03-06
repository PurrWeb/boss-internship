class Api::V1::HoursConfirmation::ClockInNoteSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :note,
    :staffMember,
    :venue,
    :date

  def staffMember
    object.staff_member.id
  end

  def venue
    object.venue.id
  end

  def date
    UIRotaDate.format(object.date)
  end
end
