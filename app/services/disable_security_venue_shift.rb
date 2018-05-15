class DisableSecurityVenueShift
  Result = Struct.new(:success, :security_venue_shift, :api_errors) do
    def success?
      success
    end
  end

  def initialize(requester:, security_venue_shift:)
    @requester = requester
    @security_venue_shift = security_venue_shift
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
      unless success
        api_errors = RotaShiftApiErrors.new(rota_shift: security_venue_shift)
        ActiveRecord::Rollback
      end
    end

    Result.new(success, security_venue_shift, api_errors)
  end

  private
  attr_reader :requester, :security_venue_shift
end
