class VenuesController < ApplicationController
  before_action :authorize

  def index
    venues = Venue.all
    render locals: { venues: venues }
  end

  def new
    venue = Venue.new
    render locals: { venue: venue }
  end

  def create
    venue = Venue.new(venue_params)

    if venue.save
      flash[:success] = "Venue added successfully"
      redirect_to action: :index
    else
      flash.now[:error] = "There was a problem creating this venue"
      render 'new', locals: { venue: venue }
    end
  end

  private
  def authorize
    authorize! :manage, :admin
  end

  def venue_params
    params.require(:venue).
      permit(:name).merge(
        creator: current_user
      )
  end
end
