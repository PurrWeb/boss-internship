class DisableDisciplinary
  Result = Struct.new(:success, :disciplinary) do
    def success?
      success
    end
  end

  def initialize(disciplinary:, requester:, user_ability: UserAbility.new(current_user))
    @disciplinary = disciplinary
    @requester = requester
    @user_ability = user_ability
  end

  def call
    user_ability.authorize!(:disable, disciplinary)

    success = false
    ActiveRecord::Base.transaction do
      success = disciplinary.update({ disabled_by_user: requester, disabled_at: Time.zone.now })
      raise ActiveRecord::Rollback unless success
    end
    Result.new(success, disciplinary)
  end

  private
  attr_reader :disciplinary, :requester, :user_ability
end
