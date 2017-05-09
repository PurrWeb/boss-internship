class SiaBadgeExpiryNotificationJob < ActiveJob::Base
  def perform
    SendSiaBadgeExpiryNotifications.new.call
  end
end
