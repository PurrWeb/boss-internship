require 'will_paginate/array'

class MaintenanceController < ApplicationController
  before_filter :set_new_layout

  def index
    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!
    venues = AccessibleVenuesQuery.new(current_user).all
    maintenance_tasks_filter = MaintenanceTaskFilter.new(statuses: 'pending,completed,rejected').fetch
    statuses = (current_user.maintenance_staff?) ? ['pending', 'completed'] : MaintenanceTaskStateMachine.states
    maintenance_tasks = maintenance_tasks_filter.
      paginate(
        page: page_number,
        per_page: 10
      )


    render locals: {
      access_token: access_token,
      current_user: current_user,
      maintenance_tasks: maintenance_tasks,
      current_page_number: page_number,
      venues: venues,
      statuses: statuses,
      priorities: MaintenanceTask.priorities.keys.map { |p| p.split('_').first },
      page_number: page_number,
      total_count: MaintenanceTask.count,
      total_pages: (MaintenanceTask.count / 10) + 1
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
