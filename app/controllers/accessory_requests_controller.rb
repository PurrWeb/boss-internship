class AccessoryRequestsController < ApplicationController
  before_action :set_new_layout

  def index
    if !index_params_present?
      return redirect_to(accessory_requests_path(index_redirect_params))
    end

    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!

    render locals: {
      access_token: access_token.token,
      current_venue: venue_from_params.id,
      venues: ActiveModel::Serializer::CollectionSerializer.new(
        accessible_venues,
        serializer: Api::V1::SimpleVenueSerializer,
      ),
    }
  end

  private
  def index_redirect_params
    venue = venue_from_params || current_user.default_venue
    {
      venue_id: venue.id,
    }
  end

  def index_params_present?
    venue_from_params.present?
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
