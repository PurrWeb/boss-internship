class ChangeOrderReminderJob < ActiveJob::Base
  def perform
    change_orders = ChangeOrder.current
    venues_without_current_change_order = VenueWithoutAssociatedQuery.new(associated_relation: change_orders).all

    venues_without_current_change_order.each do |venue|
      SendChangeOrderNotifications.new(venue: venue).call
    end
  end
end
