class CreateOpsDiaryApiService
  Result = Struct.new(:success, :ops_diary, :api_errors) do
    def success?
      success
    end
  end

  def initialize(requester:, ability: UserAbility.new(requester))
    @requester = requester
    @ability = ability
  end
  attr_reader :requester, :ability

  def call(params:)
    ability.authorize!(:create, :ops_diary)

    ops_diary_params = {
      title: params.fetch(:title),
      text: params.fetch(:text),
      priority: params.fetch(:priority),
      venue: Venue.find_by(id: params["venueId"]),
      created_by_user: requester
    }

    model_service_result = CreateOpsDiary.new(
      params: ops_diary_params
    ).call

    api_errors = nil
    unless model_service_result.success?
      api_errors = OpsDiaryApiErrors.new(ops_diary: model_service_result.ops_diary)
    end
    Result.new(model_service_result.success?, model_service_result.ops_diary, api_errors)
  end
end
