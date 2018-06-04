class DeleteHolidayRequest
  class Result < Struct.new(:success, :holiday_request)
    def success?
      success
    end
  end

  def initialize(requester:, holiday_request:)
    @requester = requester
    @holiday_request = holiday_request
    @ability = UserAbility.new(requester)
  end

  def call
    result = true
    ability.authorize!(:destroy, holiday_request)

    if holiday_request.pending?
      holiday_request.destroy
    else
      holiday_request.errors.add(:base, "can't delete holiday request, holiday request are not in pending status")
      result = false
    end

    Result.new(result, holiday_request)
  end

  private
  attr_reader :requester, :holiday_request, :ability
end
