class VerifyWtlClientEmail
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
    success = wtl_client.verified!
    Result.new(success, wtl_client)
  end

  private

  attr_reader :wtl_client
end
