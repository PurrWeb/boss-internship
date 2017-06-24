class ChangeOrdersController < ApplicationController
  before_action :set_new_layout, only: [:index, :submitted]

  def index
    if venue_from_params.present?
      current_venue = venue_from_params

      accessible_venues = AccessibleVenuesQuery.new(current_user).all

      current_change_order = ChangeOrder.current.for_venue(venue: current_venue).last ||
        ChangeOrder.build_default(venue: current_venue)

      authorize! :update, current_change_order

      render locals: {
        current_venue: current_venue,
        current_change_order: current_change_order,
        accessible_venues: accessible_venues
      }
    else
      redirect_to(change_orders_path(index_redirect_params))
    end
  end

  def submitted
    raise ActiveRecord::RecordNotFound unless venue_from_params.present?

    change_orders = ChangeOrder.
      not_in_state(:in_progress).
      includes(:change_order_transitions).
      order('change_order_transitions.created_at DESC').
      where(venue: venue_from_params).
      paginate(page: params[:page], per_page: 15)

    render locals: {
      venue: venue_from_params,
      change_orders: change_orders
    }
  end

  def edit
    change_order = ChangeOrder.find(params[:id])
    authorize! :update, change_order

    render locals: {
      change_order: change_order
    }
  end

  def show
    change_order = ChangeOrder.find(params[:id])

    render locals: { change_order: change_order }
  end

  def update
    change_order = ChangeOrder.find(params[:id])
    authorize! :update, change_order

    if change_order.update_attributes(update_params)
      flash[:success] = "Update successful"
      redirect_to change_order_path(change_order)
    else
      flash.now[:error] = "There was a problem updating this change order"
      render 'index', locals: {
        change_order: change_order
      }
    end
  end

  def update_current
    if venue_from_params.present?
      current_venue = venue_from_params

      current_change_order = ChangeOrder.current.for_venue(venue: current_venue).last ||
        ChangeOrder.build_default(venue: current_venue)

      authorize! :update, current_change_order

      if current_change_order.update_attributes(update_params)
        flash[:success] = "Update successful"
        redirect_to change_orders_path(
          venue_id: current_venue.id
        )
      else
        accessible_venues = AccessibleVenuesQuery.new(current_user).all

        flash.now[:error] = "There was a problem updating this change order"
        render 'index', locals: {
          current_venue: current_venue,
          current_change_order: current_change_order,
          accessible_venues: accessible_venues
        }
      end
    else
      render :nothing => true, :status => :bad_request
    end
  end

  def destroy
    change_order = ChangeOrder.find(params[:id])
    authorize! :destroy, change_order

    change_order.state_machine.transition_to!(
      :deleted,
      requster_user_id: current_user.id
    )

    flash[:success] = "Delete successful"
    redirect_to(change_order_path(change_order))
  end

  private
  def index_redirect_params
    venue = venue_from_params || current_user.default_venue

    {
      venue_id: venue.andand.id
    }
  end

  def date_from_params
    if params[:date].present?
      UIRotaDate.parse(params[:date])
    end
  end

  def date_from_params_valid?
    date_from_params.present? &&
      date_from_params == RotaWeek.new(date_from_params).start_date
  end

  def venue_from_params
    Venue.find_by(id: params[:venue_id])
  end

  def update_params
    params.require(:change_order).
      permit([
        :five_pound_notes,
        :one_pound_coins,
        :fifty_pence_coins,
        :twenty_pence_coins,
        :ten_pence_coins,
        :five_pence_coins
      ])
  end
end
