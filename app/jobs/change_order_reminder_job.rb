class ChangeOrderReminderJob < RecurringJob
  def perform
    now = Time.now
    week = RotaWeek.new(now)
    last_week = RotaWeek.new(now - 1.week)
    last_week_deadline = ChangeOrderSubmissionDeadline.new(week: last_week)

    if last_week_deadline.in_notification_period?(now)
      date = week.start_date

      change_orders = ChangeOrder.where(submission_deadline: last_week_deadline)
      venues_without_change_order = VenueWithoutChangeOrderQuery.new(change_orders: change_orders).all
      venues_requiring_notification = VenueWithoutChangeOrderNotificationQuery.new(
        relation: venues_without_change_order,
        date: date
      ).all

      venues_requiring_notification.each do |venue|
        SendChangeOrderNotifications.new(date: date, venue: venue).call
      end
    end
  end
end