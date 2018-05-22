require 'will_paginate/array'

class MarketingTasksController < ApplicationController
  before_filter :set_new_layout

  def index
    authorize! :view, :marketing_tasks_page

    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!
    venues = AccessibleVenuesQuery.new(current_user).all
    marketing_task_filter = MarketingTaskFilter.new(current_user, {})
    marketing_tasks_query = marketing_task_filter.query(
      relation: MarketingTask.includes(:venue, :disabled_by_user, :marketing_task_transitions, :marketing_task_notes, marketing_task_assignments: :user, assigned_to_user: :name, created_by_user: :name, completed_by_user: :name)
    )
    marketing_tasks = marketing_tasks_query.paginated(
      page: params[:page],
      tasks_per_page: 5
    )

    statuses = (current_user.marketing_staff?) ? ['pending', 'completed'] : MarketingTaskStateMachine.states
    marketing_task_users = User.marketing.includes(:name)

    render locals: {
      access_token: access_token,
      current_user: current_user,
      marketing_tasks: marketing_tasks,
      venues: venues,
      statuses: statuses,
      marketing_task_users: marketing_task_users,
      general_task_count: marketing_tasks_query.general_task_count,
      music_task_count: marketing_tasks_query.music_task_count,
      sports_task_count: marketing_tasks_query.sports_task_count,
      artwork_task_count: marketing_tasks_query.artwork_task_count,
      user_permissions: Permissions::MarketingTaskPermissions.new(current_user)
    }
  end

  def page_number
    if params[:page].present?
      params[:page].to_i
    else
      1
    end
  end
end
