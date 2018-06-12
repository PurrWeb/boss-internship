class SecurityVenueApiErrors
  def initialize(security_venue:)
    @security_venue = security_venue
  end
  attr_reader :security_venue

  def errors
    result = {}
    result[:base] = security_venue.errors[:base] if security_venue.errors[:base].present?

    result
  end
end
