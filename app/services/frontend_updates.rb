class FrontendUpdates
  def initialize(security_app_update_service: SecurityAppUpdateService.new)
    wipe_values
    @security_app_update_service = security_app_update_service
  end

  def dispatch(reraise_errors: BooleanEnvVariable.new("RERAISE_SSE_ERRORS").value)
    begin
      created_shifts.each_value do |shift_data|
        shift = shift_data.fetch(:shift)
        if shift.venue_type == SecurityVenueShift::SHIFT_VENUE_TYPE || shift.rota_published?
          security_app_update_service.create_shift(shift: shift) if shift.staff_member.security?
        end
      end
      shift_updates.each_value do |shift_data|
        shift = shift_data.fetch(:shift)
        if shift.venue_type == SecurityVenueShift::SHIFT_VENUE_TYPE || shift.rota_published?
          security_app_update_service.update_shift(shift: shift) if shift.staff_member.security?
        end
      end
      shift_deletes.each_value do |shift_data|
        shift = shift_data.fetch(:shift)
        if shift.venue_type == SecurityVenueShift::SHIFT_VENUE_TYPE || shift.rota_published?
          security_app_update_service.delete_shift(shift: shift) if shift.staff_member.security?
        end
      end
      staff_member_profile_updates.each_value do |update_data|
        staff_member = update_data.fetch(:staff_member)
        security_app_update_service
          .update_staff_member_profile(staff_member: staff_member) if staff_member.security?
      end
      created_venues.each_value do |venue_data|
        venue = venue_data.fetch(:venue)
        security_app_update_service.create_venue(venue: venue)
      end
      venue_updates.each_value do |venue_data|
        venue = venue_data.fetch(:venue)
        security_app_update_service.update_venue(venue: venue)
      end

      security_app_update_service.call
    rescue Exception => e
      Rollbar.error(e)
      raise e if reraise_errors
    end
  end

  def create_shift(shift:)
    created_shifts[shift.id] ||= {}
    created_shifts[shift.id][:shift] = shift
  end

  def update_shift(shift:, params: {})
    if shift_pending_create?(shift: shift)
      created_shifts[shift.id][:shift] = shift
    else
      shift_updates[shift.id] ||= {}
      shift_updates[shift.id][:shift] = shift
    end
  end

  def update_staff_member_profile(staff_member:, params: {})
    staff_member_profile_updates[staff_member.id] ||= {}
    staff_member_profile_updates[staff_member.id][:staff_member] = staff_member
  end

  def delete_shift(shift:)
    if shift_pending_create?(shift: shift)
      created_shifts.delete(shift.id)
    else
      shift_updates.delete(shift.id)
      shift_deletes[shift.id] ||= {}
      shift_deletes[shift.id][:shift] = shift
    end
  end

  def publish_rota(rota:)
    rota.rota_shifts.each do |shift|
      shift_updates[shift.id] ||= {}
      shift_updates[shift.id][:shift] = shift
    end
  end

  def create_venue(venue:)
    created_venues[venue.id] ||= {}
    created_venues[venue.id][:venue] = venue
  end

  def update_venue(venue:)
    if venue_pending_create?(venue: venue)
      created_venues[venue.id][:venue] = venue
    else
      venue_updates[venue.id] ||= {}
      venue_updates[venue.id][:venue] = venue
    end
  end

  attr_reader :shift_updates, :shift_deletes, :staff_member_profile_updates, :security_app_update_service, :created_shifts, :venue_updates, :created_venues

  def shift_pending_create?(shift:)
    created_shifts[shift.id].present?
  end

  def venue_pending_create?(venue:)
    created_venues[venue.id].present?
  end

  def wipe_values
    @created_shifts = {}
    @shift_updates = {}
    @shift_deletes = {}
    @staff_member_profile_updates = {}
    @created_venues = {}
    @venue_updates = {}
  end
end
