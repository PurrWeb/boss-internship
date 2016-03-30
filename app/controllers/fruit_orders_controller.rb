class FruitOrdersController < ApplicationController
  def index
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

  def show
    fruit_order = FruitOrder.find(params[:id])

    render locals: { fruit_order: fruit_order }
  end

  def submitted
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
    redirect_to(fruit_order_path(fruit_order))
  end

  private
  def index_redirect_params
    venue = venue_from_params || current_user.default_venue
    {
      venue_id: venue.andand.id
    }
  end

  def venue_from_params
    Venue.find_by(id: params[:venue_id])
  end

  def update_params
    params.require(:fruit_order).
      permit([
        :limes,
        :lemons,
        :rasberries,
        :blueberries,
        :blackberries,
        :green_apples,
        :oranges,
        :passion_fruits,
        :lychees,
        :cucumbers,
        :kumkwats,
        :dragon_fruits,
        :watermelon,
        :pink_grapefruit,
        :plums,
        :deskinned_coconuts,
        :fresh_mint,
        :fresh_basil,
        :fresh_lavender,
        :rosemary,
        :thyme,
        :red_roses,
        :kaffir_lime_leaves,
        :fresh_ginger,
        :bananas,
        :maraschino_cherry,
        :cream
      ])
  end
end
