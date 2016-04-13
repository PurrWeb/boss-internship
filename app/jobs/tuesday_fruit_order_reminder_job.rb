class TuesdayFruitOrderReminderJob < RecurringJob
  def perform
    venues_without_fruit_order = VenueWithoutAssociatedQuery.new(
      associated_relation: FruitOrder.current
    ).all

    venues_without_fruit_order.each do |venue|
      managers = UsersManagingVenueQuery.new(venue: venue).all

      managers.each do |manager|
        FruitOrderNotificationMailer.
          tuesday_reminder(
            user_id: manager.id,
            venue_name: venue.name
          ).deliver_now
      end
    end
  end
end
