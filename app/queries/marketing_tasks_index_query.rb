class MarketingTasksIndexQuery
  def initialize(params)
    @relation = params[:relation] || MarketingTask
    @current_user = params.fetch(:current_user)
    @assigned_to_user = params[:assigned_to_user_id]
    @late_task_only = params[:late_task_only]
    @now = params[:now] || Time.current
    @date = RotaShiftDate.to_rota_date(@now)
    @statuses = params.fetch(:statuses)
    @venues = params.fetch(:venues)
    @due_date_start = params[:due_date_start]
    @due_date_end = params[:due_date_end]
    @completed_at_start = params[:completed_at_start]
    @completed_at_end = params[:completed_at_end]
  end
  attr_reader :relation, :current_user, :assigned_to_user_id, :late_task_only, :now, :date, :statuses, :venues, :due_date_start, :due_date_end, :completed_at_start, :completed_at_end

  def paginated(page:, tasks_per_page:)
    paginate(
      tasks: general_tasks, page: page, tasks_per_page: tasks_per_page
    ) + paginate(
      tasks: artwork_tasks, page: page, tasks_per_page: tasks_per_page
    ) + paginate(
      tasks: music_tasks, page: page, tasks_per_page: tasks_per_page
    ) + paginate(
      tasks: sports_tasks, page: page, tasks_per_page: tasks_per_page
    )
  end

  def general_task_count
    general_tasks.length
  end

  def artwork_task_count
    artwork_tasks.length
  end

  def music_task_count
    music_tasks.length
  end

  def sports_task_count
    sports_tasks.length
  end

  private
  def general_tasks
    @general_tasks ||= marketing_tasks.select { |m| m.type == GeneralTask.name }
  end

  def artwork_tasks
    @artwork_tasks ||= marketing_tasks.select { |m| m.type == ArtworkTask.name }
  end

  def music_tasks
    @music_tasks ||= marketing_tasks.select { |m| m.type == MusicTask.name }
  end

  def sports_tasks
    @sports_tasks ||= marketing_tasks.select { |m| m.type == SportsTask.name }
  end
  def marketing_tasks
    @marketing_tasks ||= begin
      result = relation.in_state(statuses).where(venue: venues)

      if assigned_to_user_id.present?
        result = result.where(assigned_to_user_id: assigned_to_user_id)
      end

      if late_task_only.present?
        result = result.where("due_at < ?", date)
      end

      if (due_date_start.present? && due_date_end.present?)
        result = result.select do |marketing_task|
          marketing_task.due_at.between?(due_date_start, due_date_end)
        end
      end

      if (completed_at_start.present? && completed_at_end.present?)
        result.select do |marketing_task|
          marketing_task.completed_at.present? && marketing_task.completed_at.between?(completed_at_start, completed_at_end)
        end
      end

      result
    end
  end

  def paginate(tasks:, page:, tasks_per_page:)
    tasks.paginate(
      page: page,
      per_page: tasks_per_page
    )
  end
end
