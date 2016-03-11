class SiaNotificationMailer < ApplicationMailer
  def sia_expiry_notification_for_staff_member(staff_member_email:,sia_expiry_date:)
    if staff_member_email.present?
      mail(to: staff_member_email, subject: 'SIA Badge Expiry Warning') do |format|
        format.html do
          render locals: {
            sia_expiry_date: sia_expiry_date
          }
        end

        format.text do
          render locals: {
            sia_expiry_date: sia_expiry_date
          }
        end
      end
    end
  end

  def sia_expiry_notification_for_managers(staff_member_email:, staff_member_name:, sia_expiry_date:, manager_emails:)
    if manager_emails.present?
      mail(to: manager_emails, subject: 'SIA Badge Expiry Warning') do |format|
        format.html do
            render locals: {
              staff_member_email: staff_member_email,
              staff_member_name: staff_member_name,
              sia_expiry_date: sia_expiry_date
            }
        end

        format.text do
            render locals: {
              staff_member_email: staff_member_email,
              staff_member_name: staff_member_name,
              sia_expiry_date: sia_expiry_date
            }
        end
      end
    end
  end
end
