class StaffMemberVerificationMailer < ApplicationMailer
  def send_verification_email(staff_member:, token:)
    mail(to: staff_member.email, subject: 'Test') do |format|
      format.html do
        render locals: {
          staff_member: staff_member,
          token: token
        }
      end
    end
  end
end  
