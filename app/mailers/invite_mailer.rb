class InviteMailer < ApplicationMailer
  def invite_mail(invite)
    mail(to: invite.email, subject: 'Your invite to JSM Bars Boss System') do |format|
      format.html do
        render locals: { invite: invite }
      end

      format.text do
        render locals: { invite: invite }
      end
    end
  end
end
