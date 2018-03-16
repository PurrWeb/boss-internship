require 'will_paginate/array'

class MaintenanceController < ApplicationController
  before_filter :set_new_layout

  def index
    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!
    venues = AccessibleVenuesQuery.new(current_user).all
    maintenance_tasks = MaintenanceTaskFilter.new(
      requester: current_user,
      params: { statuses: 'pending,completed,rejected' }
    ).to_a
    statuses = (current_user.maintenance_staff?) ? ['pending', 'completed'] : MaintenanceTaskStateMachine.states
    maintenance_tasks = maintenance_tasks.
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
      total_count: maintenance_tasks.total_entries,
      total_pages: maintenance_tasks.total_pages
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
