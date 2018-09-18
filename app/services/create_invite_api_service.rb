class CreateInviteApiService
  Result = Struct.new(:invite, :success, :api_errors) do
    def success?
      success
    end
  end

  def initialize(params:, requester:)
    @params = params
    @requester = requester
  end

  def call
    invite_data = {
      first_name: params.fetch(:firstName),
      surname: params.fetch(:surname),
      venue_ids: params.fetch(:venueIds),
      email: params.fetch(:email),
    }.merge(inviter: requester)

    if params.fetch(:role) == User::MANAGER_ROLE
      invite_data = invite_data.merge({venue_ids: []})
    end

    if requester.can_create_roles.include?(params.fetch(:role))
      invite_data = invite_data.merge({role: params.fetch(:role)})
    end

    invite_result = CreateInvite.new(
      params: invite_data,
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
