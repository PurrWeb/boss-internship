# User to allow non model related permission to be set on a per venue
class HoursConfirmationPage
  def initialize(venue:)
    @venue = venue
  end

  attr_reader :venue
end
