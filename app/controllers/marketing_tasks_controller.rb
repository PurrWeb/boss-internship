require 'will_paginate/array'

class MarketingTasksController < ApplicationController
  before_filter :set_new_layout

  def index
    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!
    venues = AccessibleVenuesQuery.new(current_user).all
    marketing_task_filter = MarketingTaskFilter.new(current_user, {})
    marketing_tasks = marketing_task_filter.fetch
    statuses = (current_user.marketing_staff?) ? ['pending', 'completed'] : MarketingTaskStateMachine.states
    marketing_task_users = User.marketing

    render locals: {
      access_token: access_token,
      current_user: current_user,
      marketing_tasks: marketing_tasks,
      venues: venues,
      statuses: statuses,
      marketing_task_users: marketing_task_users,
      general_task_count: marketing_task_filter.general_tasks.length,
      music_task_count: marketing_task_filter.music_tasks.length,
      sports_task_count: marketing_task_filter.sports_tasks.length,
      artwork_task_count: marketing_task_filter.artwork_tasks.length,
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
