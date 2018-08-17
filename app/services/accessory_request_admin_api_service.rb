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
      result = accessory_request.transition_to!(:accepted, requster_user_id: requster_user.id)
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
      result = accessory_request.transition_to!(:rejected, requster_user_id: requster_user.id)
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
      result = accessory_request.transition_to!(:pending, requster_user_id: requster_user.id)
    end

    api_errors = nil
    unless result
      api_errors = AccessoryRequestApiErrors.new(accessory_request: accessory_request)
    end
    Result.new(result, accessory_request, api_errors)
  end

  def complete(now: Time.current)
    result = true
    if accessory_request.frozen?
      accessory_request.errors.add(:base, "can't complete accessory request that has been frozen")
      result = false
    else
      result = false
      ActiveRecord::Base.transaction do
        service_result = CompleteAccessoryRequest.new(accessory_request: accessory_request, requester: requster_user, now: now).call
        result = service_result.success?
        raise ActiveRecord::Rollback unless result
      end
    end

    api_errors = nil
    unless result
      api_errors = AccessoryRequestApiErrors.new(accessory_request: accessory_request)
    end
    Result.new(result, accessory_request, api_errors)
  end

  attr_reader :requster_user, :ability, :accessory_request
end
