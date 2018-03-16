class MaintenanceTaskIndexQuery
  def initialize(relation: MaintenanceTask, start_date:, end_date:, venues:, statuses:, priorities:)
    @relation = relation
    @start_date = start_date
    @end_date = end_date
    @venues = venues
    @statuses = statuses
    @priorities = priorities
  end
  attr_reader :relation, :start_date, :end_date, :venues, :statuses, :priorities

  def to_a
    maintenance_tasks = relation.
      priority_order.
      includes(
        :venue,
        :maintenance_task_images,
        :maintenance_task_transitions,
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
      [maintenance_task.priority_number, maintenance_task.status_number]
    end
  end
end
