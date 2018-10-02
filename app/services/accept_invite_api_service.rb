class AcceptInviteApiService
  Result = Struct.new(:user, :success, :api_errors) do
    def success?
      success
    end
  end

  def initialize(params:)
    @params = params
  end

  def call
    invite = Invite.find_by!(token: params.fetch(:id))

    invite_result = AcceptInvite.new(
      invite: invite,
      password: params.fetch(:password),
    ).call

    api_errors = nil

    unless invite_result.success?
      api_errors = InviteApiErrors.new(invite: invite_result.user)
    end

    Result.new(invite_result.user, invite_result.success?, api_errors)
  end

  private

  attr_reader :params
end
