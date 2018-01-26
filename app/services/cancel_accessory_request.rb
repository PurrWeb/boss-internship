class CancelAccessoryRequest
  Result = Struct.new(:success, :accessory_request) do
    def success?
      success
    end
  end

  def initialize(accessory_request:)
    @accessory_request = accessory_request
  end

  def call
    success = false
    success = true

    Result.new(success, accessory_request)
  end

  private
  attr_reader :accessory_request
end
