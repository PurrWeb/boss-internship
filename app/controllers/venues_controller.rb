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
    venue = Venue.new

    result = UpdateVenue.new(venue: venue, params: create_params, reminder_users: reminder_users_from_params).call
    if result.success?
      flash[:success] = "Venue added successfully"
      redirect_to action: :index
    else
      flash.now[:error] = "There was a problem creating this venue"
      render 'new', locals: { venue: result.venue }
    end
  end

  def edit
    venue = Venue.find(params[:id])
    render locals: { venue: venue }
  end

  def update
    venue = Venue.find(params[:id])

    result = UpdateVenue.new(venue: venue, params: update_params, reminder_users: reminder_users_from_params).call
    if result.success?
      flash[:success] = "Venue updated successfully"
      redirect_to action: :index
    else
      flash.now[:error] = "There was a problem updating this venue"
      render 'edit', locals: { venue: result.venue }
    end
  end

  private
  def authorize
    authorize! :manage, :admin
  end

  def create_params
    params.require(:venue).
      permit(
        :name,
        :longitude,
        :latitude
      ).merge(
        creator: current_user,
        fruit_order_fields: fruit_order_fields_from_params
      ).merge(
        float_field_values
      )
  end

  def update_params
    params.require(:venue).
      permit(
        :name,
        :longitude,
        :latitude
      ).merge(
        fruit_order_fields: fruit_order_fields_from_params
      ).merge(
        float_field_values
      )
  end

  def float_field_values
    result = {}
    [:till_float_cents, :safe_float_cents].each do |field|
      parsed_value = nil
      unparsed_value = params["venue"].fetch(field)
      begin
        parsed_value = Float(unparsed_value)
      rescue ArgumentError, TypeError
      end

      if parsed_value.present?
        result[field] = (parsed_value * 100.0).floor
      else
        result[field] = unparsed_value
      end
    end
    result
  end

  def reminder_users_from_params
    User.enabled.where(id: Array(params[:venue][:reminder_user_ids]))
  end

  def fruit_order_fields_from_params
    Array(params["venue"]["fruit_order_fields"]).reject(&:blank?).map(&:to_sym)
  end
end
