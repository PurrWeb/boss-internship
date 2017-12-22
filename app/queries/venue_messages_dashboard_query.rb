class VenueMessagesDashboardQuery
  def initialize(venue:)
    @venue = venue
  end

  def all
    messages = (
      DashboardMessage.where(to_all_venues: true).enabled + venue.dashboard_messages.enabled
    ).uniq.sort_by(&:published_time).reverse

    messages = messages.select do |message|
      message.published_time < Time.now
    end[0..9]
  end

  private
  attr_reader :venue
end
