class FruitOrdersController < ApplicationController
  before_action :set_new_layout, only: [:index, :submitted]

  def index
    authorize!(:view, :fruit_orders_page)

    if venue_from_params.present?
      current_venue = venue_from_params

      accessible_venues = AccessibleVenuesQuery.new(current_user).all

      current_fruit_order = FruitOrder.current.find_by(
        venue: current_venue
      ) || FruitOrder.build_default(
        venue: current_venue
      )

      authorize! :update, current_fruit_order

      render locals: {
        current_venue: current_venue,
        current_fruit_order: current_fruit_order,
        accessible_venues: accessible_venues
      }
    else
      redirect_to(fruit_orders_path(index_redirect_params))
    end
  end

  def edit
    fruit_order = FruitOrder.find(params[:id])
    authorize! :update, fruit_order

    render locals: { fruit_order: fruit_order }
  end

  def update
    fruit_order = FruitOrder.find(params[:id])
    authorize! :update, fruit_order

    if fruit_order.update_attributes(update_params)
      flash[:success] = "Update successful"
      redirect_to fruit_orders_path
    else
      flash.now[:error] = "There was a problem updating this fruit order"
      render 'index', locals: {
        fruit_order: fruit_order
      }
    end
  end


  def submitted
    authorize!(:view, :fruit_orders_page)

    raise ActiveRecord::RecordNotFound unless venue_from_params.present?

    fruit_orders = FruitOrder.
      not_in_state(:in_progress, :deleted).
      includes(:fruit_order_transitions).
      order('fruit_order_transitions.created_at DESC').
      where(venue: venue_from_params).
      paginate(page: params[:page], per_page: 15)

    render locals: {
      venue: venue_from_params,
      fruit_orders: fruit_orders
    }
  end

  def update_current
    if venue_from_params.present?
      current_venue = venue_from_params

      current_fruit_order = FruitOrder.
        current.
        where(venue: current_venue).
        last || FruitOrder.build_default(
          venue: current_venue
        )

      authorize! :update, current_fruit_order

      if current_fruit_order.update_attributes(update_params)
        flash[:success] = "Update successful"
        redirect_to fruit_orders_path(
          venue_id: current_venue.id
        )
      else
        accessible_venues = AccessibleVenuesQuery.new(current_user).all

        flash.now[:error] = "There was a problem updating this fruit order"
        render 'index', locals: {
          current_venue: current_venue,
          current_fruit_order: current_fruit_order,
          accessible_venues: accessible_venues
        }
      end
    else
      render :nothing => true, :status => :bad_request
    end
  end

  def destroy
    fruit_order = FruitOrder.find(params[:id])
    authorize! :destroy, fruit_order

    fruit_order.state_machine.transition_to!(
      :deleted,
      requster_user_id: current_user.id
    )

    flash[:success] = "Delete successful"
    redirect_to(fruit_orders_path)
  end

  private
  def index_redirect_params
    venue = venue_from_params || current_venue
    {
      venue_id: venue.andand.id
    }
  end

  def venue_from_params
    Venue.find_by(id: params[:venue_id])
  end

  def update_params
    params.require(:fruit_order).
      permit(FruitOrder::FIELDS)
  end
end
