class FruitOrderReportsController < ApplicationController
  before_action :authorize_admin
  before_action :set_new_layout, only: [:index, :history]

  def index
    authorize!(:view, :fruit_order_reports)

    pending_fruit_orders = FruitOrder.current.includes(:venue)
    pending_show_fields = FruitOrderShowFields.new(pending_fruit_orders)

    accepted_fruit_orders = FruitOrder.accepted.includes(:venue)
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
    authorize!(:accept, :fruit_order_reports)

    fruit_order = FruitOrder.find(params[:id])

    fruit_order.state_machine.transition_to!(
      :accepted,
      requster_user_id: current_user.id
    )

    flash[:success] = "Fruit order accepted successfully"
    redirect_to(fruit_order_reports_path)
  end

  def complete
    authorize!(:complete, :fruit_order_reports)

    fruit_orders = FruitOrder.where(id: params.fetch("fruit_order_ids"))

    CompleteFruitOrders.new(
      requester: current_user,
      fruit_orders: fruit_orders
    ).call

    flash[:success] = "Fruit orders completed successfully"
    redirect_to(fruit_order_reports_path)
  end

  def history
    authorize!(:view, :fruit_order_reports)

    fruit_orders = FruitOrder.
      done.
      includes([:fruit_order_transitions, :venue]).
      order('fruit_order_transitions.updated_at DESC').
      paginate(
        page: params[:page],
        per_page: 15
      )

    render locals: { fruit_orders: fruit_orders }
  end

  private
  def date_from_params
    if params[:id].present?
      UIRotaDate.parse(params[:id])
    end
  end
end
