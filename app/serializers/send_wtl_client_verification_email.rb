class SendWtlClientVerificationEmail
  def initialize(wtl_client:)
    @wtl_client = wtl_client
  end
  attr_reader :wtl_client

  def call
    name = wtl_client.name
    email_address = wtl_client.email
    link_url = wtl_verify_path(verification_code: wtl_client.verification_code)

    WtlClientVerificationMailer.verification_email(
      name: name,
      email_address: email_address,
      link_url: link_url
    ).deliver_now
  end
end
