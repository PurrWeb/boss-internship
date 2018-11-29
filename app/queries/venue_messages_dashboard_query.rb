class VenueMessagesDashboardQuery
  MESSAGE_DISPLAY_LIMIT = 10

  def initialize(venue:)
    @venue = venue
  end

  def all
    messages = (
      DashboardMessage.where(to_all_venues: true).enabled.includes(preload_fields) +
      venue.dashboard_messages.enabled.includes(preload_fields)
    ).uniq.sort_by(&:published_time).reverse

    messages = messages.select do |message|
      message.published_time < Time.now
    end[0..(MESSAGE_DISPLAY_LIMIT - 1)]
  end

  private
  attr_reader :venue

  def preload_fields
    [:disabled_by_user, created_by_user: [:name]]
  end
end
