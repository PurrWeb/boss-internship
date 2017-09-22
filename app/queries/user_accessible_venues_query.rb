class UserAccessibleVenuesQuery
  def initialize(user:, master_venue:, work_venues:)
    @user = user
    @master_venue = master_venue
    @work_venues = work_venues
  end

  def page_venues
    combined_venues = AccessibleVenuesQuery.new(user).all + [master_venue] + work_venues
    combined_venues.uniq {|venue| venue.id }
  end

  private
  attr_reader :user, :master_venue, :work_venues
end
