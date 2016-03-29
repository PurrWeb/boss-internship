class ChangeOrderNotificationMailer < ApplicationMailer
  def change_order_reminder(user_id:, venue_name:, deadline:)
    deadline = Time.parse(deadline)
    user = User.find(user_id)

    mail(
      to: user.email,
      subject: "Change order not created for #{venue_name}"
    ) do |format|
      format.html do
        render locals: { venue_name: venue_name, deadline: deadline }
      end

      format.text do
        render locals: { venue_name: venue_name, deadline: deadline }
      end
    end
  end

  private
  attr_reader :user_id, :venue_name, :date
end
