class ClockingAppFrontendUpdates
  def initialize(venue_api_key:, clocking_app_update_service: ClockingAppUpdateService.new(venue_api_key: venue_api_key))
    wipe_values
    @clocking_app_update_service = clocking_app_update_service
  end

  def dispatch(reraise_errors: BooleanEnvVariable.new("RERAISE_SSE_ERRORS").value)
    begin
      clocking_events.each_value do |clocking_event|
        clocking_app_update_service.clocking_events_updates(clocking_event: clocking_event)
      end
      clocking_app_update_service.call
    rescue Exception => e
      Rollbar.error(e)
      raise e if reraise_errors
    end
  end

  def clocking_events_updates(clocking_event:, params: {})
    clocking_events[clocking_event.id] = clocking_event
  end

  attr_reader :clocking_events, :clocking_app_update_service

  def wipe_values
    @clocking_events = {}
  end
end
