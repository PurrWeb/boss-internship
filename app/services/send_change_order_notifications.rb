class SendChangeOrderNotifications
  def initialize(venue:)
    @venue = venue
  end

  def call
    managers = UsersManagingVenueQuery.new(venue: venue).all
    notify_users = venue.reminder_users.enabled

    users = QueryCombiner.new(
      base_scope: User,
      relation_1: managers,
      relation_2: notify_users
    ).all

    users.each do |manager|
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
