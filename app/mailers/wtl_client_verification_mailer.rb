class WtlClientVerificationMailer < ApplicationMailer
  def verification_email(name:, email_address:, link_url:)
    mail(
      to: email_address,
      from: 'no-reply@welcome2liverpool.co.uk',
      subject: 'Welcome to Liverpool: Verify your Email Address',
    ) do |format|
      format.html do
        render locals: {
          name: name,
          link_url: link_url
        }
      end
    end
  end
end
