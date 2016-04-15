class FruitOrderReportsController < ApplicationController
  before_action :authorize_admin

  def index
    pending_fruit_orders = FruitOrder.current
    pending_show_fields = FruitOrderShowFields.new(pending_fruit_orders)

    accepted_fruit_orders = FruitOrder.accepted
    accepted_show_fields = FruitOrderShowFields.new(accepted_fruit_orders)

    venues_without_pending_fruit_order = VenueWithoutAssociatedQuery.new(
      associated_relation: pending_fruit_orders
    ).all

    render locals: {
      venues_without_pending_fruit_order: venues_without_pending_fruit_order,
      pending_fruit_orders: pending_fruit_orders,
      pending_show_fields: pending_show_fields,
      accepted_fruit_orders: accepted_fruit_orders,
      accepted_show_fields: accepted_show_fields
    }
  end

  def accept
    fruit_order = FruitOrder.find(params[:id])

    fruit_order.state_machine.transition_to!(
      :accepted,
      requster_user_id: current_user.id
    )

    flash[:success] = "Fruit order accepted successfully"
    redirect_to(fruit_order_reports_path)
  end

  def complete
    fruit_order = FruitOrder.find(params[:id])

    fruit_order.state_machine.transition_to!(
      :done,
      requster_user_id: current_user.id
    )

    flash[:success] = "Fruit order completed successfully"
    redirect_to(fruit_order_reports_path)
  end

  def history
    fruit_orders = FruitOrder.
      done.
      includes(:fruit_order_transitions).
      order('fruit_order_transitions.updated_at DESC').
      paginate(
        page: params[:page],
        per_page: 15
      )

    render locals: { fruit_orders: fruit_orders }
  end

  private
  def authorize_admin
    authorize! :manage, :admin
  end

  def date_from_params
    if params[:id].present?
      UIRotaDate.parse(params[:id])
    end
  end
end
