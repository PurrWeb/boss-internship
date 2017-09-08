class CurrentVenueService
  def initialize(user:, venue_id:)
    @user = user
    @venue_id = venue_id
    @accessible_venues = AccessibleVenuesQuery.new(user).all
  end

  attr_reader :user, :venue_id, :accessible_venues

  def venue
    accessible_venues.find(venue_id_from_redis) || accessible_venues.find(venue_id) || user.default_venue
  end

  def set_current_venue
    if venue_id && venue_id_from_redis != venue_id
      redis.set(
        current_venue_for_user,
        venue_id
      )
    end
  end

  def self.redis
    Redis.current
  end

  def redis
    Redis.current
  end

  private
  def current_venue_for_user
    "current_venue_for_user:#{user.id}"
  end

  def venue_id_from_redis
    redis.get(current_venue_for_user)
  end
end
