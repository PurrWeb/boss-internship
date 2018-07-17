class FrontendUpdates
  def initialize(
    security_app_frontend_updates: SecurityAppFrontendUpdates.new
  )
    @security_app_frontend_updates = security_app_frontend_updates
  end

  def dispatch(reraise_errors: BooleanEnvVariable.new("RERAISE_SSE_ERRORS").value)
    begin
      security_app_frontend_updates.dispatch(reraise_errors: reraise_errors)
    rescue Exception => e
      Rollbar.error(e)
      raise e if reraise_errors
    end
  end

  def create_shift(shift:)
    security_app_frontend_updates.create_shift(shift: shift)
  end

  def create_security_venue_shift(security_venue_shift:)
    security_app_frontend_updates.create_security_venue_shift(security_venue_shift: security_venue_shift)
  end

  def update_shift(shift:, params: {})
    security_app_frontend_updates.update_shift(shift: shift, params: params)
  end

  def update_security_venue_shift(security_venue_shift:, params: {})
    security_app_frontend_updates.update_shift(security_venue_shift: security_venue_shift, params: params)
  end

  def delete_shift(shift:)
    security_app_frontend_updates.delete_shift(shift: shift)
  end

  def delete_security_venue_shift(security_venue_shift:)
    security_app_frontend_updates.delete_security_venue_shift(security_venue_shift: security_venue_shift)
  end

  def update_staff_member_profile(staff_member:, params: {})
    security_app_frontend_updates.update_staff_member_profile(staff_member: staff_member, params: params)
  end

  def publish_rota(rota:)
    security_app_frontend_updates.publish_rota(rota: rota)
  end

  def create_venue(venue:)
    security_app_frontend_updates.create_venue(venue: venue)
  end

  def update_venue(venue:)
    security_app_frontend_updates.update_venue(venue: venue)
  end

  attr_reader \
    :security_app_frontend_updates
end