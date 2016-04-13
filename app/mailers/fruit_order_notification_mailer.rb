class FruitOrderNotificationMailer < ApplicationMailer
  def tuesday_reminder(user_id:, venue_name:)
    user = User.find(user_id)

    mail(
      to: user.email,
      subject: "Fruit Order Reminder for #{venue_name}"
    ) do |format|
      format.html do
        render locals: { venue_name: venue_name }
      end

      format.text do
        render locals: { venue_name: venue_name }
      end
    end
  end

  def friday_reminder(user_id:, venue_name:)
    user = User.find(user_id)

    mail(
      to: user.email,
      subject: "Fruit Order Reminder for #{venue_name}"
    ) do |format|
      format.html do
        render locals: { venue_name: venue_name }
      end

      format.text do
        render locals: { venue_name: venue_name }
      end
    end
  end
end
