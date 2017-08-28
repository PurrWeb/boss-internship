class IncidentReportsController < ApplicationController
  before_filter :check_venue
  before_filter :set_new_layout

  def index
    authorize! :manage, :incident_reports

  end

  def create
    render json: {}
  end

  private

  def check_venue
    unless venue_from_params.present?
      redirect_to(check_lists_path(index_redirect_params))
    end
  end

  def index_redirect_params
    venue = venue_from_params || current_user.default_venue
    {
      venue_id: venue.andand.id
    }
  end

  def venue_params
    params.permit(:venue_id)
  end

  def venue_from_params
    if current_user.has_all_venue_access?
      Venue.find_by({id: venue_params[:venue_id]})
    else
      current_user.venues.find_by(id: venue_params[:venue_id])
    end
  end
end
