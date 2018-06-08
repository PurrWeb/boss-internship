class ClockingAppFrontendUpdates
  def initialize(venue_api_key:, clocking_app_update_service: ClockingAppUpdateService.new(venue_api_key: venue_api_key))
    wipe_values
    @clocking_app_update_service = clocking_app_update_service
  end

  def dispatch(reraise_errors: BooleanEnvVariable.new("RERAISE_SSE_ERRORS").value)
    begin
      created_shifts.each_value do |shift_data|
        shift = shift_data.fetch(:shift)
        clocking_app_update_service.create_shift(shift: shift)
      end
      shift_updates.each_value do |shift_data|
        shift = shift_data.fetch(:shift)
        clocking_app_update_service.update_shift(shift: shift)
      end
      shift_deletes.each_value do |shift_data|
        shift = shift_data.fetch(:shift)
        clocking_app_update_service.delete_shift(shift: shift)
      end
      clocking_events.each_value do |clocking_event|
        clocking_app_update_service.clocking_events_updates(clocking_event: clocking_event)
      end
      clocking_app_update_service.call
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

  def clocking_events_updates(clocking_event:, params: {})
    clocking_events[clocking_event.id] = clocking_event
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

  attr_reader :clocking_events, :shift_updates, :shift_deletes, :staff_member_profile_updates, :clocking_app_update_service, :created_shifts, :venue_updates, :created_venues

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
    @clocking_events = {}
  end
end
