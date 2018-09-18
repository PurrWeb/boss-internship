class RevokeInvite
  Result = Struct.new(:success, :invite) do
    def success?
      success
    end
  end

  def initialize(invite:)
    @invite = invite
  end

  def call
    success = false

    if invite.present?
      success = invite.revoke!
    end

    Result.new(success, invite)
  end

  private

  attr_reader :invite
end
