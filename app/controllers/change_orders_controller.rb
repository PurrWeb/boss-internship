class ChangeOrdersController < ApplicationController
  def index
    if venue_from_params.present? && date_from_params.present? && date_from_params_valid?
      current_venue = venue_from_params
      date = date_from_params
      accessible_venues = AccessibleVenuesQuery.new(current_user).all

      current_change_order = ChangeOrder.find_by(
        date: date,
        venue: current_venue
      ) || ChangeOrder.build_default(
        date: date,
        venue: current_venue
      )

      authorize! :manage, current_change_order

      render locals: {
        date: date,
        current_venue: current_venue,
        current_change_order: current_change_order,
        accessible_venues: accessible_venues
      }
    else
      redirect_to(change_orders_path(index_redirect_params))
    end
  end

  def update
    if venue_from_params.present? && date_from_params.present? && date_from_params_valid?
      current_venue = venue_from_params
      date = date_from_params

      current_change_order = ChangeOrder.find_by(
        date: date,
        venue: current_venue
      ) || ChangeOrder.build_default(
        date: date,
        venue: current_venue
      )

      authorize! :manage, current_change_order

      if !current_change_order.submission_deadline_past? &&
          current_change_order.update_attributes(update_params)
        flash[:success] = "Update successful"
        redirect_to change_orders_path(
          date: UIRotaDate.format(date),
          venue_id: current_venue.id
        )
      else
        if current_change_order.submission_deadline_past?
          raise 'Illegal attempt to update change order past deadline'
        end

        accessible_venues = AccessibleVenuesQuery.new(current_user).all

        flash.now[:error] = "There was a problem updating this change order"
        render 'index', locals: {
          date: date,
          current_venue: current_venue,
          current_change_order: current_change_order,
          accessible_venues: accessible_venues
        }
      end
    else
      render :nothing => true, :status => :bad_request
    end
  end

  private
  def index_redirect_params
    week = RotaWeek.new(date_from_params || Time.now)
    venue = venue_from_params || current_user.default_venue

    {
      date: UIRotaDate.format(week.start_date),
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
