class SecurityShiftRequestsController < ApplicationController
  before_action :set_new_layout

  def index
    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!

    render locals: {
      access_token: access_token.token,
    }
  end

  private
  def index_redirect_params
    venue = venue_from_params || current_user.default_venue
    {
      venue_id: venue.id,
      status: "enabled"
    }
  end

  def index_params_present?
    venue_from_params.present? &&
    params[:status].present?
  end

  def accessible_venues
    AccessibleVenuesQuery.new(current_user).all
  end

  def venue_from_params
    accessible_venues.find_by(id: params[:venue_id])
  end

end
