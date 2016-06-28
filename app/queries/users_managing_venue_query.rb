class UsersManagingVenueQuery
  def initialize(venue:)
    @venue = venue
  end

  def all
    all_venues_users = User.
      enabled.
      with_all_venue_access

    specific_venue_users = User.
      enabled.
      joins(:venue_users).
      where('venue_users.venue_id = ?', venue.id)

    QueryCombiner.new(
      base_scope: User,
      relation_1: all_venues_users,
      relation_2: specific_venue_users
    ).all
  end

  private
  attr_reader :venue
end
