class DestroySecurityShiftRequest
  Result = Struct.new(:success, :security_shift_request) do
    def success?
      success
    end
  end

  def initialize(requester:, security_shift_request:)
    @requester = requester
    @security_shift_request = security_shift_request
  end

  def call
    success = false
    success_transition = false

    ActiveRecord::Base.transaction do

      security_shift_request.deleted_at = Time.now
      security_shift_request.deleted_by = requester
      success_transition = security_shift_request.transition_to(:deleted)
      success = security_shift_request.save
      raise ActiveRecord::Rollback unless success && success_transition
    end
    Result.new((success && success_transition), security_shift_request)
  end

  private
  attr_reader :requester, :security_shift_request
end
