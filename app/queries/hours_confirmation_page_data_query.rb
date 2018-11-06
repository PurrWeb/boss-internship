class HoursConfirmationPageDataQuery
  def initialize(all_clock_in_days = [], accessible_venues = [])
    @all_clock_in_days = all_clock_in_days
    @accessible_venues = accessible_venues
    @owned_venues = []
    @readonly_venues = []
    @owned_venues_clock_in_days = []
    @readonly_venues_clock_in_days = []
  end

  attr_reader :owned_venues, :readonly_venues, :owned_venues_clock_in_days, :readonly_venues_clock_in_days

  def query
    all_clock_in_days.each do |clock_in_day|
      venue = clock_in_day.venue
      if accessible_venues.exists?(venue)
        owned_venues << venue
        owned_venues_clock_in_days << clock_in_day
      else
        readonly_venues << venue
        readonly_venues_clock_in_days << clock_in_day
      end
    end
    {
      venues: owned_venues,
      clock_in_days: owned_venues_clock_in_days,
      readonly_venues: readonly_venues,
      readonly_clock_in_days: readonly_venues_clock_in_days
    }
  end

  private
  attr_reader :all_clock_in_days, :accessible_venues

end
