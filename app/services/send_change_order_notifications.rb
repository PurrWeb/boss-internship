class SendChangeOrderNotifications
  def initialize(venue:)
    @venue = venue
  end

  def call
    managers = UsersManagingVenueQuery.new(venue: venue).all

    managers.each do |manager|
      ChangeOrderNotificationMailer.
        change_order_reminder(
          user_id: manager.id,
          venue_name: venue.name
        ).deliver_now
    end
  end

  private
  attr_reader :date, :venue
end
