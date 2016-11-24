class ChangeOrderReportsController < ApplicationController
  before_action :authorize_admin

  def index
    pending_change_orders = ChangeOrder.current.includes(:venue)
    accepted_change_orders = ChangeOrder.accepted.includes(:venue)

    venues_without_pending_change_order = VenueWithoutAssociatedQuery.new(
      associated_relation: pending_change_orders
    ).all

    render locals: {
      venues_without_pending_change_order: venues_without_pending_change_order,
      pending_change_orders: pending_change_orders,
      accepted_change_orders: accepted_change_orders
    }
  end

  def accept
    change_order = ChangeOrder.find(params[:id])

    change_order.state_machine.transition_to!(
      :accepted,
      requster_user_id: current_user.id
    )

    flash[:success] = "Change order accepted successfully"
    redirect_to(change_order_reports_path)
  end

  def complete
    change_order = ChangeOrder.find(params[:id])

    change_order.state_machine.transition_to!(
      :done,
      requster_user_id: current_user.id
    )

    flash[:success] = "Change order completed successfully"
    redirect_to(change_order_reports_path)
  end

  def show
    deadline_date = date_from_params
    submission_deadline = ChangeOrderSubmissionDeadline.from_deadline_date(deadline_date).time

    change_orders = ChangeOrder.
      where('? = DATE(submission_deadline)', deadline_date)

    venues_without_change_orders = VenueWithoutAssociatedQuery.new(
      associated_relation: change_orders
    ).all

    render locals: {
      submission_deadline: submission_deadline,
      change_orders: change_orders,
      venues_without_change_orders: venues_without_change_orders
    }
  end

  def edit
    change_order = ChangeOrder.find(params[:id])

    render locals: { change_order: change_order }
  end

  def history
    change_orders = ChangeOrder.
      done.
      includes([:change_order_transitions, :venue]).
      order('change_order_transitions.updated_at DESC').
      paginate(
        page: params[:page],
        per_page: 15
      )

    render locals: { change_orders: change_orders }
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
