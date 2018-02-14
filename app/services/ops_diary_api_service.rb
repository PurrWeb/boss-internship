class OpsDiaryApiService
  Result = Struct.new(:success, :ops_diary, :api_errors) do
    def success?
      success
    end
  end

  def initialize(requester:, ops_diary:, venue:)
    @requester = requester
    @ops_diary = ops_diary
    @venue = venue
    @ability = UserAbility.new(requester)
  end

  def create(params:)
    # assert_action_permitted(:create)

    ops_diary_params = {
      title: params.fetch(:title),
      text: params.fetch(:text),
      priority: params.fetch(:priority),
    }.merge(venue: venue, created_by_user: requester)

    model_service_result = CreateOpsDiary.new(
      params: ops_diary_params
    ).call

    api_errors = nil
    unless model_service_result.success?
      api_errors = OpsDiaryApiErrors.new(ops_diary: model_service_result.ops_diary)
    end
    Result.new(model_service_result.success?, model_service_result.ops_diary, api_errors)
  end

  def update(params:)
    ops_diary_params = {
      title: params.fetch(:title),
      text: params.fetch(:text),
      priority: params.fetch(:priority),
    }.merge({venue: venue})

    model_service_result = UpdateOpsDiary.new(
      ops_diary: ops_diary,
      params: ops_diary_params
    ).call

    api_errors = nil
    unless model_service_result.success?
      api_errors = OpsDiaryApiErrors.new(ops_diary: model_service_result.ops_diary)
    end
    Result.new(model_service_result.success?, model_service_result.ops_diary, api_errors)
  end

  def disable
    model_service_result = DisableOpsDiary.new(
      ops_diary: ops_diary,
    ).call

    api_errors = nil
    unless model_service_result.success?
      api_errors = OpsDiaryApiErrors.new(ops_diary: model_service_result.ops_diary)
    end
    Result.new(model_service_result.success?, model_service_result.ops_diary, api_errors)
  end

  def enable
    model_service_result = EnableOpsDiary.new(
      ops_diary: ops_diary,
    ).call

    api_errors = nil
    unless model_service_result.success?
      api_errors = OpsDiaryApiErrors.new(ops_diary: model_service_result.ops_diary)
    end
    Result.new(model_service_result.success?, model_service_result.ops_diary, api_errors)
  end

  attr_reader :requester, :ops_diary, :ability, :venue

  private
  def assert_action_permitted(action)
    case action
    when :create
      ability.authorize!(:create, ops_diary)
    when :update
      ability.authorize!(:update, ops_diary)
    when :destroy
      ability.authorize!(:destroy, ops_diary)
    else
      raise "unsupported action: #{action} supplied"
    end
  end
end
