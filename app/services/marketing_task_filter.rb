require 'will_paginate/array'

class MarketingTaskFilter
  attr_reader :show_only_incomplete, :due_date_start, :due_date_end,
    :completed_at_start, :completed_at_end, :statuses, :venues, :late_task_only, :page,
    :assigned_to_user_id, :assigned_to_self, :current_user

  attr_accessor :general_tasks, :artwork_tasks, :music_tasks, :sports_tasks

  def initialize(current_user, params = {})
    @current_user = current_user
    @late_task_only = true?(params[:lateTaskOnly])
    @due_date_start = Date.parse(params[:dueAtStartDate]) if params[:dueAtStartDate].present?
    @due_date_end = Date.parse(params[:dueAtEndDate]) if params[:dueAtEndDate].present?
    @completed_at_start = Date.parse(params[:completedAtStartDate]) if params[:completedAtStartDate].present?
    @completed_at_end = Date.parse(params[:completedAtEndDate]) if params[:completedAtEndDate].present?
    @statuses = set_statuses(params[:statuses] || 'pending')
    @venues = set_venues(params[:venues] || '')
    @assigned_to_user_id = params[:assignedToUser]
    @assigned_to_self = true?(params[:assignedToSelf])
    @page = params[:page] || 1

    @marketing_tasks = MarketingTask.includes(:venue, :created_by_user, :disabled_by_user, :marketing_task_transitions, :assigned_to_user, :completed_by_user, :marketing_task_notes)
  end

  def fetch
    @marketing_tasks = @marketing_tasks.in_state(@statuses).where(venue: @venues)

    if assigned_to_self
      @marketing_tasks = @marketing_tasks.where(assigned_to_user_id: current_user.id)
    end

    if assigned_to_user_id.present?
      @marketing_tasks = @marketing_tasks.where(assigned_to_user_id: assigned_to_user_id)
    end

    if late_task_only.present?
      @marketing_tasks = @marketing_tasks.where("due_at < ?", Date.today)
    end

    @marketing_tasks = @marketing_tasks.select do |marketing_task|
      marketing_task.due_at.between?(due_date_start, due_date_end)
    end if (due_date_start.present? && due_date_end.present?)

    @marketing_tasks = @marketing_tasks.select do |marketing_task|
      marketing_task.completed_at.present? && marketing_task.completed_at.between?(completed_at_start, completed_at_end)
    end if (completed_at_start.present? && completed_at_end.present?)

    paginate_tasks
  end

  private

  def true?(value)
    value.to_s == 'true'
  end

  def paginate_tasks
    @general_tasks = @marketing_tasks.select { |m| m.type == GeneralTask.name }
    @artwork_tasks = @marketing_tasks.select { |m| m.type == ArtworkTask.name }
    @music_tasks = @marketing_tasks.select { |m| m.type == MusicTask.name }
    @sports_tasks = @marketing_tasks.select { |m| m.type == SportsTask.name }

    paginate(general_tasks) + paginate(artwork_tasks) + paginate(music_tasks) + paginate(sports_tasks)
  end

  def paginate(tasks, per_page = 5)
    tasks.paginate(
      page: page,
      per_page: per_page
    )
  end

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
      MarketingTaskStateMachine.states
    end
  end
end
