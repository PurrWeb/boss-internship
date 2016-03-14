class SiaNotificationPreview < ActionMailer::Preview
  def sia_expiry_notification_for_staff_member_preview
    staff_member_email = 'security_staff_member@jsmbars.co.uk'
    sia_expiry_date = 6.weeks.from_now

    SiaNotificationMailer.sia_expiry_notification_for_staff_member(
      staff_member_email: staff_member_email,
      sia_expiry_date: sia_expiry_date
    )
  end

  def sia_expiry_notification_for_managers_preview
    staff_member_email = 'security_staff_member@jsmbars.co.uk'
    sia_expiry_date = 6.weeks.from_now
    staff_member_name = 'Davie Doorman'
    manager_emails = ['admin_1@jsmbars.co.uk', 'sucurity_manager1@jsmbars.co.uk']

    SiaNotificationMailer.sia_expiry_notification_for_managers(
      manager_emails: manager_emails,
      staff_member_email: staff_member_email,
      staff_member_name: staff_member_name,
      sia_expiry_date: sia_expiry_date
    )
  end
end
