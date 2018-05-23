class MaintenanceTaskIndexQuery
  SORT_TYPES = [:status_focused, :priority_focused]

  def initialize(relation: MaintenanceTask, start_date:, end_date:, venues:, statuses:, priorities:, sort_type:)
    @relation = relation
    @start_date = start_date
    @end_date = end_date
    @venues = venues
    @statuses = statuses
    @priorities = priorities
    raise "unexpected sort_type #{supplied}. Legal Values: #{SORT_TYPES}" unless SORT_TYPES.include?(sort_type)
    @sort_type = sort_type
  end
  attr_reader :relation, :start_date, :end_date, :venues, :statuses, :priorities, :sort_type

  def to_a
    maintenance_tasks = relation.
      priority_order.
      includes(
        :venue,
        :maintenance_task_images,
        :maintenance_task_transitions,
        maintenance_task_notes: [
          :disabled_by_user,
          { creator_user: [:name] }
        ],
        creator_user: [:name],
        disabled_by_user: [:name]
      )

    maintenance_tasks = maintenance_tasks.select do |maintenance_task|
      maintenance_task.created_at.between?(start_date, end_date)
    end if (start_date.present? && end_date.present?)

    maintenance_tasks = maintenance_tasks.select do |maintenance_task|
      venues.include?(maintenance_task.venue) &&
        statuses.include?(maintenance_task.state_machine.current_state) &&
        priorities.include?(maintenance_task.priority)
    end
    maintenance_tasks = maintenance_tasks.sort_by do |maintenance_task|
      case sort_type
      when :priority_focused
        [maintenance_task.priority_sort_key, maintenance_task.status_sort_key(sort_type: sort_type), maintenance_task.created_at]
      when :status_focused
        [maintenance_task.status_sort_key(sort_type: sort_type), maintenance_task.priority_sort_key, maintenance_task.created_at]
      else
        raise "Unsupported sort type #{sort_type} encountered"
      end
    end
  end
end
