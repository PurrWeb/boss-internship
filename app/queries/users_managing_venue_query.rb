class UsersManagingVenueQuery
  def initialize(venue:)
    @venue = venue
  end

  def all
    User.
      enabled.
      joins(:venue_users).
      where('venue_users.venue_id = ?', venue.id)
  end

  private
  attr_reader :venue
end
