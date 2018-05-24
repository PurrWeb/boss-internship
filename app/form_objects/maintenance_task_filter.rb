class MaintenanceTaskFilter
  def initialize(requester:, params:)
    @start_date = params[:startDate] if params[:startDate].present?
    @end_date = params[:endDate] if params[:endDate].present?
    @statuses = (params[:statuses] || '').split(',').map do |state_from_params|
      raise "invalid state #{state_from_params} supplied" unless MaintenanceTaskStateMachine.states.include?(state_from_params)
      state_from_params
    end
    priorties_from_params = (params[:priorities] || '').split(',').map do |form_value|
      priority_enum_from_form_value(form_value)
    end
    @priorities = priorties_from_params
    accessible_venues = AccessibleVenuesQuery.new(requester).all
    venue_from_params = (params[:venues] || '').split(',').map do |id|
      accessible_venues.find_by(id: id)
    end
    @venues = venue_from_params.present? ? venue_from_params : accessible_venues
    @query_sort_type = requester.maintenance_staff? ? :priority_focused : :status_focused
  end
  attr_reader :show_only_incomplete, :start_date, :end_date, :statuses, :priorities, :venues, :query_sort_type

  def to_a
    MaintenanceTaskIndexQuery.new(
      start_date: start_date,
      end_date: end_date,
      priorities: priorities,
      venues: venues,
      statuses: statuses,
      sort_type: query_sort_type
    ).to_a
  end

  private
  def priority_enum_from_form_value(form_value)
    form_value = form_value + "_priority"
    MaintenanceTask.priorities[form_value]
  end

  def default_priorities
    MaintenanceTask.priorities.keys
  end
end
