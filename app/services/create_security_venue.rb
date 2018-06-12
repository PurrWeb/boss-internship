class CreateSecurityVenue
  Result = Struct.new(:success, :security_venue) do
    def success?
      success
    end
  end

  def initialize(params:)
    @params = params
  end

  def call
    success = false
    security_venue = nil

    security_venue = SecurityVenue.new(params)
    success = security_venue.save

    Result.new(success, security_venue)
  end

  private
  attr_reader :params
end
