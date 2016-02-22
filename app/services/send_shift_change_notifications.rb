class SendShiftChangeNotifications
  def initialize(staff_member)
    @staff_member = staff_member
  end

  def call
    ShiftChangeNotificationMailer.
      notify_of_shift_change_mail(staff_member: staff_member).
      deliver_now

    staff_member.mark_notified!
  end

  private
  attr_reader :staff_member
end
