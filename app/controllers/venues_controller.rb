class VenuesController < ApplicationController
  before_action :authorize

  def index
    venues = Venue.all.
      order(:name).
      paginate(page: params[:page], per_page: 25)

    render locals: { venues: venues }
  end

  def new
    venue = Venue.new
    render locals: { venue: venue }
  end

  def create
    venue = Venue.new(create_params)

    if venue.save
      flash[:success] = "Venue added successfully"
      redirect_to action: :index
    else
      flash.now[:error] = "There was a problem creating this venue"
      render 'new', locals: { venue: venue }
    end
  end

  def edit
    venue = Venue.find(params[:id])
    render locals: { venue: venue }
  end

  def update
    venue = Venue.find(params[:id])

    if venue.update_attributes(update_params)
      flash[:success] = "Venue updated successfully"
      redirect_to action: :index
    else
      flash.now[:error] = "There was a problem updating this venue"
      render 'edit', locals: { venue: venue }
    end
  end

  private
  def authorize
    authorize! :manage, :admin
  end

  def create_params
    params.require(:venue).
      permit(
        :name
      ).merge(
        creator: current_user,
        fruit_order_fields: fruit_order_fields_from_params
      )
  end

  def update_params
    params.require(:venue).
      permit(
        :name
      ).merge(
        fruit_order_fields: fruit_order_fields_from_params
      )
  end

  def fruit_order_fields_from_params
    Array(params["venue"]["fruit_order_fields"]).reject(&:blank?).map(&:to_sym)
  end
end
