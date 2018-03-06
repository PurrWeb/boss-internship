require 'will_paginate/array'

class MarketingTaskFilter

  def initialize(current_user, params = {})
    @current_user = current_user
    @accessible_venues = AccessibleVenuesQuery.new(current_user).all
    @late_task_only = true?(params[:lateTaskOnly])
    @due_date_start = Date.parse(params[:dueAtStartDate]) if params[:dueAtStartDate].present?
    @due_date_end = Date.parse(params[:dueAtEndDate]) if params[:dueAtEndDate].present?
    @completed_at_start = Date.parse(params[:completedAtStartDate]) if params[:completedAtStartDate].present?
    @completed_at_end = Date.parse(params[:completedAtEndDate]) if params[:completedAtEndDate].present?
    @statuses = set_statuses(params[:statuses] || 'pending')
    @venues = set_venues(params[:venues].andand.split(','), @accessible_venues)
    @assigned_to_self = true?(params[:assignedToSelf])
    @assigned_to_user_id = @assigned_to_self ? current_user.id : params[:assignedToUser]
    @page = params[:page] || 1
  end
  attr_reader :show_only_incomplete, :due_date_start, :due_date_end, :completed_at_start, :assessible_venues, :completed_at_end, :statuses, :venues, :late_task_only, :page, :assigned_to_user_id, :assigned_to_self, :current_user

  def query
    MarketingTasksIndexQuery.new(
      current_user: current_user,
      assigned_to_user_id: assigned_to_user_id,
      late_task_only: late_task_only,
      statuses: statuses,
      venues: venues,
      due_date_start: due_date_start,
      due_date_end: due_date_end,
      completed_at_start: completed_at_start,
      completed_at_end: completed_at_end
    )
  end

  private
  def true?(value)
    value.to_s == 'true'
  end

  def set_venues(venue_ids, accessible_venues)
    if venue_ids.present?
      accessible_venues.where(id: venue_ids)
    else
      accessible_venues
    end
  end

  def set_statuses(statuses_from_params)
    statuses = statuses_from_params.split(',')

    if statuses.present?
      statuses
    else
      MarketingTaskStateMachine.states
    end
  end
end
