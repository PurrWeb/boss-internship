class ResendWtlClientVerificationEmail
  Result = Struct.new(:success, :wtl_client) do
    def success?
      success
    end
  end

  def initialize(wtl_client:)
    @wtl_client = wtl_client
  end

  def call
    success = false
    if wtl_client.verified?
      wtl_client.errors.add(:base, "Can't resend verification email for verifier wtl client")
    else
      ActiveRecord::Base.transaction do
        verification_token = SecureRandom.hex
        success = wtl_client.update(verification_token: verification_token)
        SendWtlClientVerificationEmail.new(wtl_client: wtl_client).call if success

        raise ActiveRecord::Rollback unless success
      end
    end

    Result.new(success, wtl_client)
  end

  private

  attr_reader :wtl_client
end
