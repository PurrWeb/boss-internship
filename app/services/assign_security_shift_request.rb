class AssignSecurityShiftRequest
  Result = Struct.new(:success, :security_shift_request) do
    def success?
      success
    end
  end

  def initialize(requester:, security_shift_request:, staff_member:, starts_at:, ends_at:)
    @requester = requester
    @staff_member = staff_member
    @security_shift_request = security_shift_request
    @starts_at = starts_at
    @ends_at = ends_at
  end

  def call
    frontend_updates = FrontendUpdates.new
    success = false

    ActiveRecord::Base.transaction do
      security_shift_request.transition_to(:assigned)
      created_rota_shift_result = CreateRotaShift.new(
        creator: requester,
        rota_date: RotaShiftDate.to_rota_date(security_shift_request.starts_at),
        venue: security_shift_request.venue,
        rota_shift_params: {
          starts_at: starts_at,
          ends_at: ends_at,
          shift_type: 'normal',
          staff_member: staff_member,
        },
        frontend_updates: frontend_updates,
        authorization_proc: lambda do |rota_shift|
        end
      ).call
      security_shift_request.created_shift = created_rota_shift_result.rota_shift
      security_shift_request.save
      success = security_shift_request.valid?

      raise ActiveRecord::Rollback unless success
    end
    Result.new(success, security_shift_request)
  end

  private
  attr_reader :requester, :security_shift_request, :staff_member, :starts_at, :ends_at
end
