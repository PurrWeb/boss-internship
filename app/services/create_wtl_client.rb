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

    wtl_client = WtlClient.new(params)
    success = wtl_client.save

    Result.new(success, wtl_client)
  end

  private

  attr_reader :params
end
