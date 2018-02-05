class AccessoryRequestAdminApiService
  Result = Struct.new(:success, :accessory_request, :api_errors) do
    def success?
      success
    end
  end

  def initialize(requster_user:, accessory_request:)
    @requster_user = requster_user
    @accessory_request = accessory_request
  end

  def accept
    result = true
    if accessory_request.frozen?
      accessory_request.errors.add(:base, "can't accept accessory request that has been frozen")
      result = false
    else
      result = accessory_request.transition_to!(:accepted, requster_user_id: requster_user.id, type: "response")
    end

    api_errors = nil
    unless result
      api_errors = AccessoryRequestApiErrors.new(accessory_request: accessory_request)
    end
    Result.new(result, accessory_request, api_errors)
  end

  def reject
    result = true
    if accessory_request.frozen?
      accessory_request.errors.add(:base, "can't reject accessory request that has been frozen")
      result = false
    else
      result = accessory_request.transition_to!(:rejected, requster_user_id: requster_user.id, type: "response")
    end

    api_errors = nil
    unless result
      api_errors = AccessoryRequestApiErrors.new(accessory_request: accessory_request)
    end
    Result.new(result, accessory_request, api_errors)
  end

  def undo
    result = true
    if accessory_request.frozen?
      accessory_request.errors.add(:base, "can't undo accessory request that has been frozen")
      result = false
    else
      result = accessory_request.transition_to!(:undo, requster_user_id: requster_user.id, type: "response")
    end

    api_errors = nil
    unless result
      api_errors = AccessoryRequestApiErrors.new(accessory_request: accessory_request)
    end
    Result.new(result, accessory_request, api_errors)
  end

  def complete
    result = true
    if accessory_request.frozen?
      accessory_request.errors.add(:base, "can't complete accessory request that has been frozen")
      result = false
    else
      result = accessory_request.transition_to!(:completed, requster_user_id: requster_user.id, type: "response")
    end

    api_errors = nil
    unless result
      api_errors = AccessoryRequestApiErrors.new(accessory_request: accessory_request)
    end
    Result.new(result, accessory_request, api_errors)
  end

  attr_reader :requster_user, :ability, :accessory_request
end
