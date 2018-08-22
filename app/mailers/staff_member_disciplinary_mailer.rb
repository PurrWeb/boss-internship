class StaffMemberDisciplinaryMailer < ApplicationMailer
  layout "mailer_styled"
  COMPANY_NAME = "PUB INVEST GROUP LTD"
  APPEAL_TO_NAME = "Bill Billington"

  def send_disciplinary_email(disciplinary:)
    mail(to: disciplinary.staff_member.email, subject: "Reset your JSM Bars Password") do |format|
      format.html do
        render locals: {
          disciplinary: disciplinary,
        }
      end
    end
  end
end
