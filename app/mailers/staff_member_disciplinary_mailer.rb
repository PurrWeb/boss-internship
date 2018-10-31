class StaffMemberDisciplinaryMailer < ApplicationMailer
  layout "mailer_styled"
  COMPANY_NAME = "PUB INVEST GROUP LTD"
  APPEAL_TO_NAME = "Sina (sina@jsmbars.co.uk)"

  def send_disciplinary_email(disciplinary:)
    mail(
      to: disciplinary.staff_member.email,
      bcc: ["sina@jsmbars.co.uk"],
      subject: "Notice of #{disciplinary.warning_level_text}",
    ) do |format|
      format.html do
        render locals: {
          disciplinary: disciplinary,
        }
      end
    end
  end
end
