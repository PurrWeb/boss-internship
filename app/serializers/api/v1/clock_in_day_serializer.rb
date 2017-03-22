class Api::V1::ClockInDaySerializer < ActiveModel::Serializer
  attributes :id, :date, :venue, :staff_member, :clock_in_notes, :clock_in_periods,
             :hours_acceptance_periods, :status

  def date
    object.date.iso8601
  end

  def venue
    { id: object.venue_id }
  end

  def staff_member
    { id: object.staff_member_id }
  end

  def clock_in_notes
    object.clock_in_notes.map do |clock_in_note|
      { id: clock_in_note.id }
    end
  end

  def clock_in_periods
    object.clock_in_periods.map do |clock_in_period|
      { id: clock_in_period.id }
    end
  end

  def hours_acceptance_periods
    object.hours_acceptance_periods.map do |hours_acceptance_period|
      { id: hours_acceptance_period.id }
    end
  end

  def status
    object.current_clock_in_state
  end
end
