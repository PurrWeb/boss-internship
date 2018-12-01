class VenuesController < ApplicationController
  def index
    authorize!(:view, :venues_page)

    venues = Venue.all.
      order(:name).
      paginate(page: params[:page], per_page: 25)

    render locals: { venues: venues }
  end

  def new
    authorize!(:create, :venues)

    venue = Venue.new
    render locals: { venue: venue }
  end

  def create
    authorize!(:create, :venues)

    result = CreateVenue.new(requester: current_user, params: create_params).call
    if result.success?
      frontend_updates = FrontendUpdates.new
      frontend_updates.create_venue(venue: result.venue)
      frontend_updates.dispatch

      flash[:success] = "Venue added successfully"
      redirect_to action: :index
    else
      flash.now[:error] = "There was a problem creating this venue"
      render 'new', locals: { venue: result.venue }
    end
  end

  def edit
    authorize!(:edit, :venues)

    venue = Venue.find(params[:id])

    render locals: { venue: venue }
  end

  def update
    authorize!(:edit, :venues)
    venue = Venue.find(params[:id])

    result = UpdateVenue.new(venue: venue, params: update_params).call
    if result.success?
      frontend_updates = FrontendUpdates.new
      frontend_updates.update_venue(venue: result.venue)
      frontend_updates.dispatch

      flash[:success] = "Venue updated successfully"
      redirect_to action: :index
    else
      flash.now[:error] = "There was a problem updating this venue"
      render 'edit', locals: { venue: result.venue }
    end
  end

  private
  def create_params
    params.require(:venue).
      permit(
        :name,
        :longitude,
        :latitude,
        :change_order_site_id
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
        :latitude,
        :change_order_site_id,
        *Venue::ROTA_THRESHOLD_FIELDS
      ).merge(
        fruit_order_fields: fruit_order_fields_from_params
      ).merge(
        float_field_values
      ).merge(
        rota_threshold_values
      )
  end

  def rota_threshold_values
    result = {}
    Venue::ROTA_THRESHOLD_FIELDS.each do |field|
      venue_params = params.fetch(:venue)
      if venue_params.fetch(field).present?
        val = venue_params.fetch(field)
        begin
          val = Float(venue_params.fetch(field))
        rescue ArgumentError
          #Do nothing parse failed
        end

        # Convert 0 values to nil
        if val == 0.0
          result[field] = nil
        else
          result[field] = venue_params.fetch(field)
        end
      end
    end
    result
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

  def fruit_order_fields_from_params
    Array(params["venue"]["fruit_order_fields"]).reject(&:blank?).map(&:to_sym)
  end
end
