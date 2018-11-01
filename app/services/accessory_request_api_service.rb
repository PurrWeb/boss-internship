class AccessoryRequestApiService
  Result = Struct.new(:success, :accessory_request, :api_errors) do
    def success?
      success
    end
  end

  def initialize(requester:, accessory_request:, staff_member:)
    @requester = requester
    @staff_member = staff_member
    @accessory_request = accessory_request
    @ability = UserAbility.new(requester)
  end

  def create(params:)
    ability.authorize!(:create, AccessoryRequest.new(staff_member: staff_member))

    accessory = staff_member.master_venue.accessories.find_by(id: params.fetch(:accessoryId))

    accessory_request_params = {
      size: params.fetch(:size),
      price_cents: accessory.andand.price_cents,
      accessory_type: accessory.andand.accessory_type,
    }.merge(staff_member: staff_member, accessory: accessory, created_by_user: requester)

    model_service_result = CreateAccessoryRequest.new(
      params: accessory_request_params,
    ).call

    api_errors = nil
    unless model_service_result.success?
      api_errors = AccessoryRequestApiErrors.new(accessory_request: model_service_result.accessory_request)
    end
    Result.new(model_service_result.success?, model_service_result.accessory_request, api_errors)
  end

  def cancel
    ability.authorize!(:cancel, accessory_request)

    model_service_result = CancelAccessoryRequest.new(
      accessory_request: accessory_request,
      requester: requester,
    ).call

    api_errors = nil
    unless model_service_result.success?
      api_errors = AccessoryRequestApiErrors.new(accessory_request: model_service_result.accessory_request)
    end
    Result.new(model_service_result.success?, model_service_result.accessory_request, api_errors)
  end

  def refund(reusable)
    ability.authorize!(:refund_request, accessory_request)

    refund_accessory_request_params = {
      price_cents: accessory_request.price_cents,
      reusable: reusable,
    }.merge(staff_member: staff_member, accessory_request: accessory_request, created_by_user: requester)

    model_service_result = RefundAccessoryRequest.new(
      params: refund_accessory_request_params,
      requester: requester,
    ).call

    api_errors = nil
    unless model_service_result.success?
      api_errors = AccessoryRefundRequestApiErrors.new(accessory_refund_request: model_service_result.accessory_refund_request)
    end
    Result.new(model_service_result.success?, model_service_result.accessory_refund_request, api_errors)
  end

  attr_reader :requester, :ability, :accessory_request, :staff_member
end
