# Used to create venue specific permission for this page
class VenueHealthChecksPage
  def initialize(venue:)
    @venue = venue
  end
  attr_reader :venue
end
