class CreateHolidayRequest
  Result = Struct.new(:success, :holiday_request) do
    def success?
      success
    end
  end

  def initialize(params:, requester:)
    @params = params
    @requester = requester
    @ability = UserAbility.new(requester)
  end

  def call
    success = false
    holiday_request = nil

    holiday_request = HolidayRequest.new(params)
    ability.authorize!(:create, holiday_request)

    success = holiday_request.save

    Result.new(success, holiday_request)
  end

  private
  attr_reader :params, :requester, :ability
end
