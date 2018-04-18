class AssignSecurityShiftRequest
  Result = Struct.new(:success, :security_shift_request) do
    def success?
      success
    end
  end

  def initialize(requester:, security_shift_request:, staff_member:)
    @requester = requester
    @staff_member = staff_member
    @security_shift_request = security_shift_request
  end

  def call
    success = false
    frontend_updates = FrontendUpdates.new

    ActiveRecord::Base.transaction do
      success = security_shift_request.transition_to(:assigned)
      create_rota_shift_result = CreateRotaShift.new(
        creator: requester,
        rota_date: RotaShiftDate.to_rota_date(security_shift_request.starts_at),
        venue: security_shift_request.venue,
        rota_shift_params: {
          starts_at: security_shift_request.starts_at,
          ends_at: security_shift_request.ends_at,
          staff_member: staff_member,
        },
        frontend_updates: frontend_updates,
        authorization_proc: lambda do |rota_shift|
        end
      ).call
      security_shift_request.created_shift = create_rota_shift_result.rota_shift
      security_shift_request.save

      raise ActiveRecord::Rollback unless success && create_rota_shift_result.success?
    end
    Result.new(success, security_shift_request)
  end

  private
  attr_reader :requester, :security_shift_request, :staff_member
end
