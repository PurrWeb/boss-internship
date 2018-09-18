class RevokeInviteApiService
  Result = Struct.new(:invite, :success, :api_errors) do
    def success?
      success
    end
  end

  def initialize(params:)
    @params = params
  end

  def call
    invite_from_params = Invite.find_by(id: params.fetch(:id))
    invite_result = RevokeInvite.new(
      invite: invite_from_params,
    ).call

    api_errors = nil

    unless invite_result.success?
      api_errors = InviteApiErrors.new(invite: invite_result.invite)
    end
    Result.new(invite_result.invite, invite_result.success?, api_errors)
  end

  private

  attr_reader :params, :requester
end
