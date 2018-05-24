require 'will_paginate/array'

class MaintenanceController < ApplicationController
  before_filter :set_new_layout

  def index
    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!
    venues = accessible_venues
    maintenance_tasks = MaintenanceTaskFilter.new(
      requester: current_user,
      params: {
        startDate: filter_start_date_from_params,
        endDate: filter_end_date_from_params,
        venues: filter_venues_from_params.map(&:id).join(','),
        statuses: filter_statuses_from_params.join(','),
        priorities: filter_priorities_from_params.join(',')
      }
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
      total_pages: maintenance_tasks.total_pages,
      filter: {
        start_date: filter_start_date_from_params,
        end_date: filter_end_date_from_params,
        venue_ids: filter_venues_from_params,
        statuses: filter_statuses_from_params,
        priorities: filter_priorities_from_params
      }

    }
  end

  private

  def filter_start_date_from_params
    UIRotaDate.parse(params[:start_date]) if params[:start_date].present?
  end

  def filter_end_date_from_params
    UIRotaDate.parse(params[:end_date]) if params[:end_date].present?
  end

  def filter_venues_from_params
    if params[:venue_ids].present?
      accessible_venues.where(id: params[:venue_ids])
    else
      []
    end
  end

  def filter_statuses_from_params
    params[:statuses] || []
  end

  def filter_priorities_from_params
    params[:priorities] || []
  end

  def accessible_venues
    AccessibleVenuesQuery.new(current_user).all
  end

  def page_number
    if params[:page].present?
      params[:page].to_i
    else
      1
    end
  end
end
