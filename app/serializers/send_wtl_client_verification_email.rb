class SendWtlClientVerificationEmail
  def initialize(wtl_client:)
    @wtl_client = wtl_client
  end
  attr_reader :wtl_client

  def call
    name = wtl_client.full_name
    email_address = wtl_client.email
    link_url = wtl_verify_path(verificationToken: wtl_client.verification_token)

    WtlClientVerificationMailer.verification_email(
      name: name,
      email_address: email_address,
      link_url: link_url
    ).deliver_now
  end
end
