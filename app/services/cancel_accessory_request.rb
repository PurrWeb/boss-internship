class CancelAccessoryRequest
  Result = Struct.new(:success, :accessory_request) do
    def success?
      success
    end
  end

  def initialize(accessory_request:, requester:)
    @accessory_request = accessory_request
    @requester = requester
  end

  def call
    success = false
    success = accessory_request.transition_to(:canceled, requster_user_id: requester.id)

    Result.new(success, accessory_request)
  end

  private
  attr_reader :accessory_request, :requester
end
