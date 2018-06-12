class DisableSecurityVenueShift
  Result = Struct.new(:success, :security_venue_shift, :api_errors) do
    def success?
      success
    end
  end

  def initialize(requester:, security_venue_shift:, frontend_updates:)
    @requester = requester
    @security_venue_shift = security_venue_shift
    @frontend_updates = frontend_updates
  end

  def call
    raise RuntimeError.new('security venue shift already disabled') if security_venue_shift.disabled?

    api_errors = nil
    success = false

    ActiveRecord::Base.transaction do
      success = security_venue_shift.update_attributes(
        disabled_by_user: requester,
        disabled_at: Time.zone.now
      )

      if success
        frontend_updates.delete_security_venue_shift(security_venue_shift: security_venue_shift)
        security_venue_shift.staff_member.mark_requiring_notification!
      else
        api_errors = RotaShiftApiErrors.new(rota_shift: security_venue_shift)
        ActiveRecord::Rollback
      end
    end

    Result.new(success, security_venue_shift, api_errors)
  end

  private
  attr_reader :requester, :security_venue_shift, :frontend_updates
end
