class CreateWtlClient
  Result = Struct.new(:success, :wtl_client) do
    def success?
      success
    end
  end

  def initialize(params:)
    @params = params
  end

  def call
    success = false
    wtl_client = nil

    ActiveRecord::Base.transaction do
      verification_token = SecureRandom.hex
      wtl_client = WtlClient.new(params.merge(
        verification_token: verification_token
      ))
      success = wtl_client.save
      if success
        register_wtl_card_result = RegisterWtlCard.new(
          wtl_client: wtl_client,
          wtl_card: wtl_client.wtl_card
        ).call
        success = register_wtl_card_result.success?
      end
      SendWtlClientVerificationEmail.new(wtl_client: wtl_client).call if success

      raise ActiveRecord::Rollback unless success
    end

    Result.new(success, wtl_client)
  end

  private

  attr_reader :params
end
