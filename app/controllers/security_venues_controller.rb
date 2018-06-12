class SecurityVenuesController < ApplicationController
  before_action :set_new_layout

  def index
    authorize!(:view, :security_venues)
    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!
    security_venues = SecurityVenue.all.order(created_at: :desc)

    render locals: {
      access_token: access_token.token,
      security_venues: security_venues
    }
  end
end
