class ShiftChangeNotificationPreview < ActionMailer::Preview
  def notify_of_shift_change_mail
    staff_member = StaffMember.first
    ShiftChangeNotificar.notify_of_shift_change_mail(
      staff_member_id: staff_member.id
    )
  end
end
