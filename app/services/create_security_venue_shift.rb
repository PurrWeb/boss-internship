class CreateSecurityVenueShift
  class Result < Struct.new(:success, :security_venue_shift, :api_errors)
    def success?
      success
    end
  end

  def initialize(creator:, frontend_updates:, date:, venue:, security_venue_shift_params:)
    @creator = creator
    @security_venue_shift_params = security_venue_shift_params
    @venue = venue
    @frontend_updates = frontend_updates
    @date = date
  end

  def call
    result = false
    security_venue_shift = nil
    api_errors = nil
    ActiveRecord::Base.transaction do
      security_venue_shift = SecurityVenueShift.new(
        security_venue_shift_params.merge(
          creator_user: creator,
          security_venue: venue,
          date: date,
        )
      )

      result = security_venue_shift.save
      if result
        security_venue_shift.staff_member.mark_requiring_notification!
        frontend_updates.create_security_venue_shift(security_venue_shift: security_venue_shift)
      else
        api_errors = RotaShiftApiErrors.new(rota_shift: security_venue_shift)
        ActiveRecord::Rollback
      end
    end

    Result.new(result, security_venue_shift, api_errors)
  end

  private
  attr_reader :date, :creator, :security_venue_shift_params, :frontend_updates, :venue
end
