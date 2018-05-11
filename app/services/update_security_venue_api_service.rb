class UpdateSecurityVenueApiService
  Result = Struct.new(:success, :security_venue, :api_errors) do
    def success?
      success
    end
  end

  def initialize(requester:, security_venue:, ability: UserAbility.new(requester))
    @requester = requester
    @ability = ability
    @security_venue = security_venue
  end

  attr_reader :requester, :security_venue, :ability

  def call(params:)
    ability.authorize!(:update, :security_venues)

    security_venue_params = {
      name: params.fetch(:name),
      address: params.fetch(:address),
      lat: params.fetch(:lat),
      lng: params.fetch(:lng),
    }

    result = UpdateSecurityVenue.new(
      security_venue: security_venue,
    ).call(params: security_venue_params)

    api_errors = nil
    unless result.success?
      api_errors = SecurityVenueApiErrors.new(security_venue: result.security_venue)
    end
    Result.new(result.success?, result.security_venue, api_errors)
  end
end
