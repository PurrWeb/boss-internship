class ResendWtlClientVerificationEmailApiService
  Result = Struct.new(:success, :wtl_client, :api_errors) do
    def success?
      success
    end
  end

  def initialize(wtl_client:)
    @wtl_client = wtl_client
  end

  def call
    success = false
    api_errors = nil
    wtl_client.from_registration = false

    result = ResendWtlClientVerificationEmail.new(wtl_client: wtl_client).call
    unless result.success?
      api_errors = WtlClientApiErrors.new(wtl_client: wtl_client)
    end
    Result.new(success, wtl_client, api_errors)
  end

  private

  attr_reader :wtl_client
end
