class ChangeOrderReminderJob < RecurringJob
  def perform
    change_orders = ChangeOrder.current
    venues_without_current_change_order = VenueWithoutChangeOrderQuery.new(change_orders: change_orders).all

    venues_without_current_change_order.each do |venue|
      SendChangeOrderNotifications.new(venue: venue).call
    end
  end
end
