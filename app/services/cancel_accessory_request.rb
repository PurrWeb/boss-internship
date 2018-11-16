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
    success = true
    if accessory_request.frozen?
      accessory_request.errors.add(:base, "can't cancel accessory request that has been frozen")
      success = false
    else
      success = accessory_request.transition_to(:canceled, requster_user_id: requester.id)
    end

    Result.new(success, accessory_request)
  end

  private
  attr_reader :accessory_request, :requester
end
