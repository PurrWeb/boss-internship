class OpsDiaryApiService
  Result = Struct.new(:success, :ops_diary, :api_errors) do
    def success?
      success
    end
  end

  def initialize(requester:, ops_diary:, ability: UserAbility.new(requester))
    @requester = requester
    @ops_diary = ops_diary
    @ability = ability
  end

  def update(params:)
    ability.authorize!(:update, :ops_diary)

    ops_diary_params = {
      title: params.fetch(:title),
      text: params.fetch(:text),
      priority: params.fetch(:priority),
      venue: Venue.find_by(id: params.fetch(:venueId))
    }

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
    ability.authorize!(:disable, :ops_diary)

    model_service_result = DisableOpsDiary.new(
      ops_diary: ops_diary
    ).call

    api_errors = nil
    unless model_service_result.success?
      api_errors = OpsDiaryApiErrors.new(ops_diary: model_service_result.ops_diary)
    end
    Result.new(model_service_result.success?, model_service_result.ops_diary, api_errors)
  end

  def enable
    ability.authorize!(:enable, :ops_diary)

    model_service_result = EnableOpsDiary.new(
      ops_diary: ops_diary
    ).call

    api_errors = nil
    unless model_service_result.success?
      api_errors = OpsDiaryApiErrors.new(ops_diary: model_service_result.ops_diary)
    end
    Result.new(model_service_result.success?, model_service_result.ops_diary, api_errors)
  end

  attr_reader :requester, :ops_diary, :ability
end
