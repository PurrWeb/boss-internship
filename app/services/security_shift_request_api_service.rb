class SecurityShiftRequestApiService
  Result = Struct.new(:security_shift_request, :success, :api_errors) do
    def success?
      success
    end
  end

  def initialize(requester:, security_shift_request:)
    @requester = requester
    @security_shift_request = security_shift_request
    @ability = UserAbility.new(requester)
  end

  attr_reader :security_shift_request, :requester, :ability

  def update(params)
    security_shift_request_params = {
      starts_at: params.fetch(:starts_at),
      ends_at: params.fetch(:ends_at),
      note: params.fetch(:note),
    }

    result = UpdateSecurityShiftRequest.new(
      requester: requester,
      security_shift_request: security_shift_request,
    ).call(params: security_shift_request_params)

    api_errors = nil
    unless result.success?
      api_errors = SecurityShiftRequestApiErrors.new(security_shift_request: result.security_shift_request)
    end
    Result.new(result.security_shift_request, result.success?, api_errors)
  end

  def destroy
    result = DestroySecurityShiftRequest.new(
      requester: requester,
      security_shift_request: security_shift_request,
    ).call

    api_errors = nil
    unless result.success?
      api_errors = SecurityShiftRequestApiErrors.new(security_shift_request: security_shift_request)
    end
    Result.new(security_shift_request, result.success?, api_errors)
  end

  def create(params)
    security_shift_request_params = {
      starts_at: params.fetch(:starts_at),
      ends_at: params.fetch(:ends_at),
      note: params.fetch(:note),
      venue: params.fetch(:venue)
    }.merge(creator: requester)

    result = CreateSecurityShiftRequest.new(
      params: security_shift_request_params
    ).call

    api_errors = nil
    unless result.success?
      api_errors = SecurityShiftRequestApiErrors.new(security_shift_request: result.security_shift_request)
    end
    Result.new(result.security_shift_request, result.success?, api_errors)
  end

  def accept
    result = AcceptSecurityShiftRequest.new(
      requester: requester,
      security_shift_request: security_shift_request
    ).call

    api_errors = nil
    unless result.success?
      api_errors = SecurityShiftRequestApiErrors.new(security_shift_request: result.security_shift_request)
    end
    Result.new(result.security_shift_request, result.success?, api_errors)
  end

  def undo
    result = UndoSecurityShiftRequest.new(
      requester: requester,
      security_shift_request: security_shift_request
    ).call

    api_errors = nil
    unless result.success?
      api_errors = SecurityShiftRequestApiErrors.new(security_shift_request: result.security_shift_request)
    end
    Result.new(result.security_shift_request, result.success?, api_errors)
  end

  def reject(reject_reason:)
    result = RejectSecurityShiftRequest.new(
      requester: requester,
      security_shift_request: security_shift_request
    ).call(reject_reason: reject_reason)

    api_errors = nil
    unless result.success?
      api_errors = SecurityShiftRequestApiErrors.new(security_shift_request: result.security_shift_request)
    end
    Result.new(result.security_shift_request, result.success?, api_errors)
  end

  def assign(staff_member:, starts_at:, ends_at:)
    result = AssignSecurityShiftRequest.new(
      requester: requester,
      staff_member: staff_member,
      security_shift_request: security_shift_request,
      starts_at: starts_at,
      ends_at: ends_at,
    ).call

    api_errors = nil
    unless result.success?
      api_errors = SecurityShiftRequestApiErrors.new(security_shift_request: result.security_shift_request)
    end
    Result.new(result.security_shift_request, result.success?, api_errors)
  end
end
