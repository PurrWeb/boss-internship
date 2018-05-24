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
      where(venue: venues).
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

    if (start_date.present? && end_date.present?)
      maintenance_tasks = InRangeQuery.new(
        relation: maintenance_tasks,
        start_value: start_date,
        end_value: end_date,
        start_column_name: 'created_at',
        end_column_name: 'created_at',
        table_name: 'maintenance_tasks'
      )
      .all
    end

    if statuses.present?
      maintenance_tasks = maintenance_tasks.in_state(statuses)
    end

    if priorities.present?
      maintenance_tasks = maintenance_tasks.where(priority: priorities)
    end

    maintenance_tasks
  end
end
