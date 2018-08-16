class AccessoriesApiService
  Result = Struct.new(:success, :accessory, :api_errors) do
    def success?
      success
    end
  end

  def initialize(requester:, accessory:)
    @requester = requester
    @accessory = accessory
    @ability = UserAbility.new(requester)
  end

  def create(params:)
    # assert_action_permitted(:create)

    accessory_params = {
      name: params.fetch(:name),
      price_cents: params.fetch(:price_cents),
      accessory_type: params.fetch(:accessory_type),
      size: params.fetch(:size),
      user_requestable: params.fetch(:user_requestable)
    }.merge(venue: accessory.venue)

    model_service_result = CreateAccessory.new(
      params: accessory_params
    ).call

    api_errors = nil
    unless model_service_result.success?
      api_errors = AccessoryApiErrors.new(accessory: model_service_result.accessory)
    end
    Result.new(model_service_result.success?, model_service_result.accessory, api_errors)
  end

  def update(params:)
    accessory_params = {
      name: params.fetch(:name),
      price_cents: params.fetch(:price_cents),
      accessory_type: params.fetch(:accessory_type),
      size: params.fetch(:size),
      user_requestable: params.fetch(:user_requestable)
    }

    model_service_result = UpdateAccessory.new(
      accessory: accessory,
      params: accessory_params
    ).call

    api_errors = nil
    unless model_service_result.success?
      api_errors = AccessoryApiErrors.new(accessory: model_service_result.accessory)
    end
    Result.new(model_service_result.success?, model_service_result.accessory, api_errors)
  end

  def update_free_items(count:)
    restock = AccessoryStocktaking.new(
      accessory: accessory,
      count: count,
      requester: requester
    ).call

    api_errors = nil
    Result.new(true, accessory, api_errors)
  end

  def disable
    model_service_result = DisableAccessory.new(
      accessory: accessory,
    ).call

    api_errors = nil
    unless model_service_result.success?
      api_errors = AccessoryApiErrors.new(accessory: model_service_result.accessory)
    end
    Result.new(model_service_result.success?, model_service_result.accessory, api_errors)
  end

  def restore
    model_service_result = RestoreAccessory.new(
      accessory: accessory,
    ).call

    api_errors = nil
    unless model_service_result.success?
      api_errors = AccessoryApiErrors.new(accessory: model_service_result.accessory)
    end
    Result.new(model_service_result.success?, model_service_result.accessory, api_errors)
  end

  attr_reader :requester, :accessory, :ability

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
