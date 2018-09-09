class VerifyWtlClientEmailApiService
  Result = Struct.new(:wtl_client, :success, :api_errors) do
    def success?
      success
    end
  end

  def initialize(wtl_client:)
    @wtl_client = wtl_client
  end

  def call
    wtl_client_result = VerifyWtlClientEmail.new(wtl_client: wtl_client).call
    api_errors = nil
    unless wtl_client_result.success?
      api_errors = WtlClientApiErrors.new(wtl_client: wtl_client_result.wtl_client)
    end

    Result.new(wtl_client_result.wtl_client, wtl_client_result.success?, api_errors)
  end

  private

  attr_reader :wtl_client
end
