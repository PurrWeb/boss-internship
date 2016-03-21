class ReviveUser
  def initialize(requester:, user:)
    @requester = requester
    @user = user
  end

  def call
    ActiveRecord::Base.transaction do
      user.
        state_machine.
        transition_to!(
          :enabled,
          requster_user_id: requester.id
        )
    end
  end

  private
  attr_reader :requester, :user
end
