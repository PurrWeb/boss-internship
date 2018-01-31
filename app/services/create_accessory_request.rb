class CreateAccessoryRequest
  Result = Struct.new(:success, :accessory_request) do
    def success?
      success
    end
  end

  def initialize(params:)
    @params = params
  end

  def call
    success = false
    accessory_request = nil

    accessory_request = AccessoryRequest.new(params)
    success = accessory_request.save

    Result.new(success, accessory_request)
  end

  private
  attr_reader :params
end
