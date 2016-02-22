class ShiftChangeNotificationPreview < ActionMailer::Preview
  def notify_of_shift_change_mail
    staff_member = StaffMember.first
    ShiftChangeNotificationMailer.notify_of_shift_change_mail(
      staff_member: staff_member
    )
  end
end
