class SendWtlClientVerificationEmail
  def initialize(wtl_client:, url_helpers: Rails.application.routes.url_helpers)
    @wtl_client = wtl_client
    @url_helpers = url_helpers
  end
  attr_reader :wtl_client, :url_helpers

  def call
    name = wtl_client.full_name
    email_address = wtl_client.email
    link_url =  "#{ENV.fetch("WTL_VERIFY_EMAIL_ROOT_URL")}/verify?verificationCode=#{wtl_client.verification_token}"

    WtlClientVerificationMailer.verification_email(
      name: name,
      email_address: email_address,
      link_url: link_url
    ).deliver_now
  end
end
