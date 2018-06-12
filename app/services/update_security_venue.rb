class UpdateSecurityVenue
  Result = Struct.new(:success, :security_venue) do
    def success?
      success
    end
  end

  def initialize(security_venue:)
    @security_venue = security_venue
  end

  def call(params:)
    success = false

    success = security_venue.update(params)

    Result.new(success, security_venue)
  end

  private
  attr_reader :security_venue
end
