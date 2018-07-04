require 'will_paginate/array'

class MessageBoardsController < ApplicationController
  before_action :set_new_layout
  before_action :find_accessible_venues
  before_action :redirect_to_venue

  def show
    authorize! :view, :dashboard_messages_page

    current_venue = venue_from_params || current_user.default_venue
    messages = (
      DashboardMessage.where(to_all_venues: true).includes(disabled_by_user: [:name], created_by_user: [:name]) + current_venue.dashboard_messages.includes(disabled_by_user: [:name], created_by_user: [:name])
    ).uniq.sort_by(&:published_time).reverse

    render locals: {
      current_venue: current_venue,
      accessible_venues: @accessible_venues,
      all_messages: messages,
      messages: messages.paginate(page: params[:page] || 1, per_page: 5),
      access_token: current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!
    }
  end

  private

  def redirect_to_venue
    if params[:venue_id].blank? && @accessible_venues.present?
      redirect_to message_board_path(venue_id: @accessible_venues.first.id)
    end
  end

  def find_accessible_venues
    @accessible_venues = AccessibleVenuesQuery.new(current_user).all
  end

  def venue_from_params
    @accessible_venues.detect { |venue| venue.id == params[:venue_id].to_i }
  end
end
