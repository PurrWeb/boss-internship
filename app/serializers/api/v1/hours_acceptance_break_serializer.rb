class Api::V1::HoursAcceptanceBreakSerializer < ActiveModel::Serializer
  attributes :id, :starts_at, :ends_at, :hours_acceptance_period

  def hours_acceptance_period
    { id: object.hours_acceptance_period_id }
  end
end
