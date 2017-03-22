class Api::V1::HoursAcceptancePeriodSerializer < ActiveModel::Serializer
  attributes :id, :clock_in_day, :starts_at, :ends_at, :status,
             :hours_acceptance_breaks, :reason_note

  def clock_in_day
    { id: object.clock_in_day_id }
  end

  def starts_at
    object.starts_at.iso8601
  end

  def ends_at
    object.ends_at.iso8601
  end

  def hours_acceptance_breaks
    object.hours_acceptance_breaks_enabled.map do |hab|
      { id: hab.id }
    end
  end
end
