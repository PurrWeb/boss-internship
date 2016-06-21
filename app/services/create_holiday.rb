class CreateHoliday
  Result = Struct.new(:success, :holiday) do
    def success?
      success
    end
  end

  def initialize(requester:,  params:)
    @requester = requester
    @params = params
  end

  def call
    success = false
    holiday = nil
    ActiveRecord::Base.transaction do
      holiday = Holiday.new(params)
      holiday.validate_as_creation = true
      success = holiday.save
    end

    Result.new(success, holiday)
  end

  private
  attr_reader :requester, :holiday, :params
end
