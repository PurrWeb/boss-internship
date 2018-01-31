class AccessoryRequestApiService
  Result = Struct.new(:success, :accessory_request, :api_errors) do
    def success?
      success
    end
  end

  def initialize(requester:, accessory_request:)
    @requester = requester
    @accessory_request = accessory_request
    @ability = StaffMemberAbility.new(requester)
  end

  def create(params:)
    # assert_action_permitted(:create)
    accessory = requester.master_venue.accessories.find_by(id: params.fetch(:accessoryId))

    accessory_request_params = {
      size: params.fetch(:size),
      price_cents: accessory.andand.price_cents,
      accessory_type: accessory.andand.accessory_type,
    }.merge(staff_member: requester, accessory: accessory)

    model_service_result = CreateAccessoryRequest.new(
      params: accessory_request_params
    ).call

    api_errors = nil
    unless model_service_result.success?
      api_errors = AccessoryRequestApiErrors.new(accessory_request: model_service_result.accessory_request)
    end
    Result.new(model_service_result.success?, model_service_result.accessory_request, api_errors)
  end

  def cancel
    model_service_result = CancelAccessoryRequest.new(
      requester: requester,
      accessory_request: accessory_request
    ).call

    api_errors = nil
    unless model_service_result.success?
      api_errors = AccessoryRequestApiErrors.new(accessory_request: model_service_result.accessory_request)
    end
    Result.new(model_service_result.success?, model_service_result.accessory_request, api_errors)
  end

  def refund
    refund_accessory_request_params = {
      price_cents: accessory_request.price_cents,
    }.merge(staff_member: requester, accessory_request: accessory_request)

    model_service_result = RefundAccessoryRequest.new(
      params: refund_accessory_request_params
    ).call

    api_errors = nil
    unless model_service_result.success?
      api_errors = AccessoryRefundRequestApiErrors.new(accessory_refund_request: model_service_result.accessory_refund_request)
    end
    Result.new(model_service_result.success?, model_service_result.accessory_refund_request, api_errors)
  end

  attr_reader :requester, :ability, :accessory_request

  private
  def assert_action_permitted(action)
    case action
    when :create
      ability.authorize!(:create, accessory)
    when :update
      ability.authorize!(:update, accessory)
    when :destroy
      ability.authorize!(:destroy, accessory)
    else
      raise "unsupported action: #{action} supplied"
    end
  end
end
