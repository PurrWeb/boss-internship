class DeleteHoursAcceptancePeriod
  class Result < Struct.new(:success, :hours_acceptance_period)
    def success?
      success
    end
  end

  def initialize(requester:, hours_acceptance_period:)
    @requester = requester
    @hours_acceptance_period = hours_acceptance_period
  end

  def call
    result = true
    if hours_acceptance_period.editable?
      hours_acceptance_period.update_attributes!(
        status: 'deleted'
      )
    else
      hours_acceptance_period.errors.add(:base, "can't delete hours that have been frozen")
      result = false
    end

    Result.new(result, hours_acceptance_period)
  end

  private
  attr_reader :requester, :hours_acceptance_period
end
