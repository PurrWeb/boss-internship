class VenueDashboardsController < ApplicationController
  before_action :set_new_layout
  before_action :redirect_to_venue

  def show
    authorize! :view, :venue_dashboard

    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!

    messages = VenueMessagesDashboardQuery.new(
      venue: venue_from_params,
    ).all

    render_weather_widget = Rails.configuration.use_darksky_api

    render locals: {
      access_token: access_token,
      current_venue: venue_from_params,
      venues: accessible_venues,
      messages: messages,
      render_weather_widget: render_weather_widget,
    }
  end

  private

  def accessible_venues
    AccessibleVenuesQuery.new(current_user).all
  end

  def redirect_to_venue
    unless venue_from_params.present?
      redirect_venue = current_user.default_venue
      redirect_to venue_dashboard_path(venue_id: redirect_venue.id)
    end
  end

  def venue_from_params
    accessible_venues.find_by(id: params[:venue_id])
  end
end
