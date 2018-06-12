class CreateSecurityVenueApiService
  Result = Struct.new(:success, :security_venue, :api_errors) do
    def success?
      success
    end
  end

  def initialize(requester:, ability: UserAbility.new(requester))
    @requester = requester
    @ability = ability
  end

  attr_reader :requester, :ability

  def call(params:)
    ability.authorize!(:create, :security_venues)

    security_venue_params = {
      name: params.fetch(:name),
      address: params.fetch(:address),
      lat: params.fetch(:lat),
      lng: params.fetch(:lng),
      creator_user: requester,
    }

    result = CreateSecurityVenue.new(
      params: security_venue_params
    ).call

    api_errors = nil
    unless result.success?
      api_errors = SecurityVenueApiErrors.new(security_venue: result.security_venue)
    end
    Result.new(result.success?, result.security_venue, api_errors)
  end
end
