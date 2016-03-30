class SendChangeOrderNotifications
  def initialize(date:, venue:)
    @date = date
    @venue = venue
  end

  def call
    week = RotaWeek.new(date)
    deadline = ChangeOrderSubmissionDeadline.new(week: week).time
    managers = UsersManagingVenueQuery.new(venue: venue).all

    managers.each do |manager|
      ChangeOrderNotificationMailer.
        change_order_reminder(
          user_id: manager.id,
          venue_name: venue.name,
          deadline: deadline.to_s
        ).deliver_now
    end

    ChangeOrderNotification.create!(venue: venue)
  end

  private
  attr_reader :date, :venue
end
