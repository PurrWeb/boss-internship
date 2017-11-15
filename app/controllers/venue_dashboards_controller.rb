class VenueDashboardsController < ApplicationController
  before_action :set_new_layout
  before_action :find_accessible_venues
  before_action :redirect_to_venue
  before_action :find_current_venue
  before_action :find_messages

  def show
    authorize! :view, :venue_dashboard

    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!

    render locals: {
      access_token: access_token,
      current_user: current_user,
      current_venue: @current_venue,
      venues: @accessible_venues,
      messages: @messages
    }
  end

  private

  def find_accessible_venues
    @accessible_venues = AccessibleVenuesQuery.new(current_user).all
  end

  def redirect_to_venue
    if params[:venue_id].blank? && @accessible_venues.present?
      redirect_to venue_dashboard_path(venue_id: @accessible_venues.first.id)
    end
  end

  def find_current_venue
    @current_venue = Venue.find(params[:venue_id])
  end

  def find_messages
    @messages = (
      DashboardMessage.where(to_all_venues: true) + @current_venue.dashboard_messages
    ).uniq.sort_by(&:published_time).reverse

    @messages = @messages.select do |message|
      message.published_time < Time.now
    end[0..9]
  end
end
