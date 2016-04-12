class ChangeOrderNotificationMailer < ApplicationMailer
  def change_order_reminder(user_id:, venue_name:)
    user = User.find(user_id)

    mail(
      to: user.email,
      subject: "Change order Reminder for #{venue_name}"
    ) do |format|
      format.html do
        render locals: { venue_name: venue_name }
      end

      format.text do
        render locals: { venue_name: venue_name }
      end
    end
  end

  private
  attr_reader :user_id, :venue_name
end
