class CreateHolidayRequest
  Result = Struct.new(:success, :holiday_request) do
    def success?
      success
    end
  end

  def initialize(params:)
    @params = params
  end

  def call
    success = false
    holiday_request = nil

    ActiveRecord::Base.transaction do
      holiday_request = HolidayRequest.new(params)
      success = holiday_request.save
    end

    Result.new(success, holiday_request)
  end

  private
  attr_reader :params
end
