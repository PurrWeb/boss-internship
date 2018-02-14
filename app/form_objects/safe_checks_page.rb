# This form object is for cancan permissions on safe checks page
class SafeChecksPage
  def initialize(venue:)
    @venue = venue
  end

  attr_reader :venue
end
