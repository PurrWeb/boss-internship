class UpdateOwedHour
  class Result < Struct.new(:success, :owed_hour)
    def success?
      success
    end
  end

  def initialize(requester:, owed_hour:, params:)
    @requester = requester
    @owed_hour = owed_hour
    @params = params
  end

  def call
    
  end

  private
  attr_reader :requester, :owed_hour, :params

end
