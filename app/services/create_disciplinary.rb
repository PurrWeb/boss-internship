class CreateDisciplinary
  Result = Struct.new(:success, :disciplinary) do
    def success?
      success
    end
  end

  def initialize(params:, requester:, user_ability: UserAbility.new(requester))
    @params = params
    @user_ability = user_ability
  end

  def call
    success = false

    disciplinary = Disciplinary.new(params)
    user_ability.authorize!(:create_disciplinaries, disciplinary.staff_member)

    success = disciplinary.save

    Result.new(success, disciplinary)
  end

  private
  attr_reader :params, :user_ability
end
