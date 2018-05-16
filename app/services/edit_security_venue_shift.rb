class EditSecurityVenueShift
  class Result < Struct.new(:success, :security_venue_shift, :api_errors)
    def success?
      success
    end
  end

  def initialize(security_venue_shift:, security_venue_shift_params:, frontend_updates:)
    @security_venue_shift = security_venue_shift
    @security_venue_shift_params = security_venue_shift_params
    @frontend_updates = frontend_updates
  end

  def call
    result = false
    api_errors = nil

    ActiveRecord::Base.transaction do
      result = security_venue_shift.update_attributes(security_venue_shift_params)

      if result
        frontend_updates.update_shift(shift: security_venue_shift)
        security_venue_shift.staff_member.mark_requiring_notification!
      else
        api_errors = RotaShiftApiErrors.new(rota_shift: security_venue_shift)
        ActiveRecord::Rollback
      end
    end

    Result.new(result, security_venue_shift, api_errors)
  end

  private
  attr_reader :security_venue_shift, :security_venue_shift_params, :frontend_updates
end
