class ClockInDays
  def initialize(all_clock_in_days = [], staff_member_venues = [])
    @all_clock_in_days = all_clock_in_days
    @staff_member_venues = staff_member_venues
    @owned_venues = []
    @readonly_venues = []
    @owned_venues_clock_in_days = []
    @readonly_venues_clock_in_days = []
    init_clock_in_days
  end
  
  attr_reader :all_clock_in_days, :staff_member_venues, :owned_venues,
             :readonly_venues, :owned_venues_clock_in_days, :readonly_venues_clock_in_days

  private
  def init_clock_in_days
    all_clock_in_days.each do |clock_in_day|
      venue = clock_in_day.venue
      if staff_member_venues.exists?(venue)
        @owned_venues << venue
        @owned_venues_clock_in_days << clock_in_day
      else
        @readonly_venues << venue
        @readonly_venues_clock_in_days << clock_in_day
      end
    end
  end
end
