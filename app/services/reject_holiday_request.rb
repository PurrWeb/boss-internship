class RejectHolidayRequest
  Result = Struct.new(:success, :holiday_request) do
    def success?
      success
    end
  end

  def initialize(requester:, holiday_request:)
    @requester = requester,
    @holiday_request = holiday_request
    @ability = UserAbility.new(requester)
  end

  def call
    success = false

    ability.authorize!(:reject, holiday_request)
    ActiveRecord::Base.transaction do
      success = holiday_request.state_machine.transition_to(:rejected)
    end

    Result.new(success, holiday_request)
  end

  private
  attr_reader :requester, :holiday_request, :ability
end
