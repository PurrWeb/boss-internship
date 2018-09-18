class CreateInvite
  Result = Struct.new(:success, :invite) do
    def success?
      success
    end
  end

  def initialize(params:)
    @params = params
  end

  def call
    success = false
    invite = nil

    invite = Invite.new(params)
    success = invite.save
    if success
      InviteMailer.invite_mail(invite).deliver_now
    end

    Result.new(success, invite)
  end

  private

  attr_reader :params
end
