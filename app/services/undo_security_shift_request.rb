class UndoSecurityShiftRequest
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

    ActiveRecord::Base.transaction do
      success = security_shift_request.transition_to(:pending)

      raise ActiveRecord::Rollback unless success
    end
    Result.new(success, security_shift_request)
  end

  private
  attr_reader :requester, :security_shift_request
end
