class FridayFruitOrderReminderJob < RecurringJob
  def perform
    venues_without_fruit_order = VenueWithoutAssociatedQuery.new(
      associated_relation: FruitOrder.current
    ).all

    venues_without_fruit_order.each do |venue|
      managers = UsersManagingVenueQuery.new(venue: venue).all
      notify_users = venue.reminder_users.enabled

      users = QueryCombiner.new(
        base_scope: User,
        relation_1: managers,
        relation_2: notify_users
      ).all

      users.each do |manager|
        FruitOrderNotificationMailer.
          friday_reminder(
            user_id: manager.id,
            venue_name: venue.name
          ).deliver_now
      end
    end
  end
end
