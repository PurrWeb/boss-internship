class CreateHoliday
  class Result < Struct.new(:success, :holiday)
    def success?
      success
    end
  end

  def initialize(requester:, holiday_params:)
    @requester = requester
    @holiday_params = holiday_params
  end

  def call
    holiday = Holiday.new(holiday_params.merge(creator: requester))
    success = holiday.save

    return Result.new(success, holiday)
  end

  private
  attr_reader :requester, :holiday_params
end
