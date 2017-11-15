class WelcomeController < ApplicationController
  def index
    @current_layout = 'newLayout';

    venues = AccessibleVenuesQuery.new(current_user).all

    if venues.present? && can?(:view, :venue_dashboard)
      redirect_to venue_dashboard_path(venue_id: venues.first.id)
    end
  end

  def render_v2_layout?
    true
  end
end
