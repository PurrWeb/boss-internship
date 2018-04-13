class RejectHolidayRequest
  Result = Struct.new(:success, :holiday_request) do
    def success?
      success
    end
  end

  def initialize(requester:, holiday_request:)
    @requester = requester,
    @holiday_request = holiday_request
  end

  def call
    success = false

    ActiveRecord::Base.transaction do
      success = holiday_request.state_machine.transition_to(:rejected)
    end

    Result.new(success, holiday_request)
  end

  private
  attr_reader :requester, :holiday_request
end
