class MaintenanceTaskFilter
  attr_reader :show_only_incomplete, :start_date, :end_date, :statuses, :priorities, :venues

  def initialize(params = {})
    @start_date = Date.parse(params[:startDate]) if params[:startDate].present?
    @end_date = Date.parse(params[:endDate]) if params[:endDate].present?
    @statuses = set_statuses(params[:statuses] || '')
    @priorities = set_priorities(params[:priorities] || '')
    @venues = set_venues(params[:venues] || '')

    @maintenance_tasks = MaintenanceTask.priority_order
      .includes(:venue, :creator_user, :disabled_by_user, :maintenance_task_transitions)
  end

  def fetch
    @maintenance_tasks = @maintenance_tasks.select do |maintenance_task|
      maintenance_task.created_at.between?(start_date, end_date)
    end if (start_date.present? && end_date.present?)

    @maintenance_tasks = @maintenance_tasks.select do |maintenance_task|
      venues.include?(maintenance_task.venue) &&
        statuses.include?(maintenance_task.state_machine.current_state) &&
        priorities.include?(maintenance_task.priority)
    end

    @maintenance_tasks = @maintenance_tasks.sort_by do |maintenance_task|
      [maintenance_task.priority_number, maintenance_task.status_number]
    end
  end

  private

  def set_venues(venues)
    array = venues.split(',')

    if array.present?
      Venue.where(id: array)
    else
      Venue.all
    end
  end

  def set_statuses(statuses)
    array = statuses.split(',')

    if array.present?
      array
    else
      MaintenanceTaskStateMachine.states
    end
  end

  def set_priorities(priorities)
    array = priorities.split(',').map { |p| p + '_priority' }

    if array.present?
      array
    else
      MaintenanceTask.priorities.keys
    end
  end
end
