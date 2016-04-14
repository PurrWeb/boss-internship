class TestEmailTimezoneJob < RecurringJob
  def perform
    ShiftChangeNotificationMailer.test_now.deliver_now
    ShiftChangeNotificationMailer.test_later.deliver_later
  end
end
