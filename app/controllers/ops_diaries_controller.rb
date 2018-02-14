class OpsDiariesController < ApplicationController
  before_action :set_new_layout

  def index
    if !index_params_present?
      return redirect_to(ops_diaries_path(index_redirect_params))
    end

    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!

    render locals: {
      access_token: access_token.token,
    }
  end

  private
  def index_params_present?
    params[:status].in? ['all', 'active']
  end

  def index_redirect_params
    params.except("controller", "action").merge({
      status: 'active',
    })
  end

  def accessible_venues
    AccessibleVenuesQuery.new(current_user).all
  end

  def venue_from_params
    accessible_venues.find_by(id: params[:venue_id])
  end

  def show_global_venue?
    false
  end
end
