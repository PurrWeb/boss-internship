class MaintenanceTaskFilter
  def initialize(requester:, params:)
    @start_date = Date.parse(params[:startDate]) if params[:startDate].present?
    @end_date = Date.parse(params[:endDate]) if params[:endDate].present?
    @statuses = (params[:statuses] || '').split(',').map do |state_from_params|
      raise "invalid state #{state_from_params} supplied" unless MaintenanceTaskStateMachine.states.include?(state_from_params)
      state_from_params
    end
    priorties_from_params = (params[:priorities] || '').split(',').map do |form_value|
      priority_enum_from_form_value(form_value)
    end
    @priorities = priorties_from_params.present? ? priorties_from_params : default_priorities
    accessible_venues = AccessibleVenuesQuery.new(requester).all
    venue_from_params = (params[:venues] || '').split(',').map do |id|
      accessible_venues.find_by(id: id)
    end
    @venues = venue_from_params.present? ? venue_from_params : accessible_venues
  end
  attr_reader :show_only_incomplete, :start_date, :end_date, :statuses, :priorities, :venues

  def to_a
    MaintenanceTaskIndexQuery.new(
      start_date: start_date,
      end_date: end_date,
      priorities: priorities,
      venues: venues,
      statuses: statuses
    ).to_a
  end

  private
  def priority_enum_from_form_value(form_value)
    enum_key = form_value + "_priority"
    MaintenanceTask.priorities.fetch(enum_key)
  end

  def default_priorities
    MaintenanceTask.priorities.keys
  end
end
