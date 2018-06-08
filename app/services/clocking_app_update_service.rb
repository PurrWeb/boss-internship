class ClockingAppUpdateService
  def initialize(venue_api_key:, clocking_app_ably_service: ClockingAppAblyService.new(venue_api_key: venue_api_key))
    @updates = {}
    @deletes = {}
    @clocking_app_ably_service = clocking_app_ably_service
  end
  attr_reader :clocking_app_ably_service

  def create_shift(shift:)
    @updates[:shifts] ||= {}
    @updates[:shifts][shift.id] = Api::ClockingApp::V1::RotaShiftSerializer.new(shift)
  end

  def update_shift(shift:)
    @updates[:shifts] ||= {}
    @updates[:shifts][shift.id] = Api::ClockingApp::V1::RotaShiftSerializer.new(shift)
  end

  def delete_shift(shift:)
    @deletes[:shifts] ||= {}
    @deletes[:shifts][shift.id] = Api::ClockingApp::V1::RotaShiftSerializer.new(shift)
  end

  def clocking_events_updates(clocking_event:)
    @updates[:clocking_events] ||= {}
    @updates[:clocking_events][clocking_event.id] = Api::ClockingApp::V1::ClockInEventSerializer.new(clocking_event)
  end

  def call
    clocking_app_ably_service.
      clocking_app_data_update(
        updates: @updates,
        deletes: @deletes
      )
  end
end
