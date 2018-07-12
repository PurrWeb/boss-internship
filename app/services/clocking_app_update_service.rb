class ClockingAppUpdateService
  def initialize(venue_api_key:, clocking_app_ably_service: ClockingAppAblyService.new(venue_api_key: venue_api_key))
    @updates = {}
    @clocking_app_ably_service = clocking_app_ably_service
  end
  attr_reader :clocking_app_ably_service

  def clocking_events_updates(clocking_event:)
    @updates[:clocking_events] ||= {}
    @updates[:clocking_events][clocking_event.id] = Api::ClockingApp::V1::ClockInEventSerializer.new(clocking_event)
  end

  def call
    clocking_app_ably_service.
      clocking_app_data_update(
        updates: @updates,
      )
  end
end
