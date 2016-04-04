class UsersManagingVenueQuery
  def initialize(venue:)
    @venue = venue
  end

  def all
    all_venues_users = User.enabled.with_all_venue_access

    specific_venue_users = User.enabled.
      joins(:venues).uniq

    User.where(
      'id IN (?) OR id IN (?)',
      all_venues_users.pluck(:id),
      specific_venue_users.pluck(:id)
    )
  end

  private
  attr_reader :venue
end