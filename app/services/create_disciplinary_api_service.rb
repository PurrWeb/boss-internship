class CreateDisciplinaryApiService
  Result = Struct.new(:success, :disciplinary, :api_errors) do
    def success?
      success
    end
  end

  def initialize(requester:, staff_member:, ability: UserAbility.new(requester))
    @requester = requester
    @staff_member = staff_member
    @ability = ability
  end

  attr_reader :requester, :ability, :staff_member

  def call(params:)
    disciplinary_params = {
      title: params.fetch(:title),
      conduct: params.fetch(:conduct),
      consequence: params.fetch(:consequence),
      nature: params.fetch(:nature),
      created_by_user: requester,
      staff_member: staff_member,
      level: params.fetch(:level),
    }

    # Action authorization happens here
    model_service_result = CreateDisciplinary.new(
      params: disciplinary_params,
      requester: requester,
      user_ability: ability,
    ).call

    api_errors = nil
    if !model_service_result.success?
      api_errors = DisciplinaryApiErrors.new(disciplinary: model_service_result.disciplinary)
    else
      StaffMemberDisciplinaryMailer.send_disciplinary_email(disciplinary: model_service_result.disciplinary).deliver_now
    end
    Result.new(model_service_result.success?, model_service_result.disciplinary, api_errors)
  end
end
