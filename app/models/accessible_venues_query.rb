class AccessibleVenuesQuery
  def initialize(user)
    @user = user
  end

  def all
    if user.has_all_venue_access?
      Venue.all
    else
      user.venues
    end
  end

  private
  attr_reader :user
end
