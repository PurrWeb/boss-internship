class VenuesController < ApplicationController
  def index
    form_venue  = Venue.new
    venues = Venue.all
    render locals: { form_venue: form_venue, venues: venues }
  end

  def create
    venue = Venue.new(venue_params)

    if venue.save
      flash[:success] = "Venue added successfully"
      redirect_to action: :index
    else
      flash.now[:error] = "There was a problem creating this venue"
      venues = Venue.all
      render action: :index, locals: { form_venue: venue, venues: venues }
    end
  end

  private
  def venue_params
    params.require(:venue).permit(:name)
  end
end
