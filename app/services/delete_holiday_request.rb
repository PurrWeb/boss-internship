class DeleteHolidayRequest
  class Result < Struct.new(:success, :holiday_request)
    def success?
      success
    end
  end

  def initialize(requester:, holiday_request:)
    @requester = requester
    @holiday_request = holiday_request
  end

  def call
    result = true
    if holiday_request.pending?
      holiday_request.destroy
    else
      holiday_request.errors.add(:base, "can't delete holiday request, holiday request are not in pending status")
      result = false
    end

    Result.new(result, holiday_request)
  end

  private
  attr_reader :requester, :holiday_request
end
