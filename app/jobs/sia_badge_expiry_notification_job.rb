class SiaBadgeExpiryNotificationJob < RecurringJob
  def perform
    SendSiaBadgeExpiryNotifications.new.call
  end
end
