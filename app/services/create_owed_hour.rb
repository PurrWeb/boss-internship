class CreateOwedHour
  Result = Struct.new(:success, :owed_hour) do
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
    owed_hour = nil
    ActiveRecord::Base.transaction do
      owed_hour = OwedHour.new(params)
      owed_hour.validate_as_creation = true
      success = owed_hour.save
    end

    Result.new(success, owed_hour)
  end

  private
  attr_reader :requester, :owed_hour, :params
end
