class DisableDisciplinaryApiService
  Result = Struct.new(:success, :disciplinary, :api_errors) do
    def success?
      success
    end
  end

  def initialize(requester:, disciplinary:, ability: UserAbility.new(requester))
    @requester = requester
    @disciplinary = disciplinary
    @ability = ability
  end

  attr_reader :requester, :ability, :disciplinary

  def call
    ability.authorize!(:disable, disciplinary)

    model_service_result = DisableDisciplinary.new(
      disciplinary: disciplinary,
      requester: requester
    ).call

    api_errors = nil
    unless model_service_result.success?
      api_errors = DisciplinaryApiErrors.new(disciplinary: model_service_result.disciplinary)
    end
    Result.new(model_service_result.success?, model_service_result.disciplinary, api_errors)
  end
end
