class ChangeOrderReportsController < ApplicationController
  before_action :authorize_admin

  def index
    date = Time.now.to_date
    week = RotaWeek.new(date)

    current_submission_deadline = ChangeOrderSubmissionDeadline.new(week: week).time
    previous_submission_deadline = ChangeOrder.order(:submission_deadline).pluck(:submission_deadline).uniq[1]

    venues_without_current_change_order = VenueWithoutChangeOrderQuery.new(
      change_orders: ChangeOrder.current
    ).all

    previous_submission_change_orders = ChangeOrder.where(submission_deadline: previous_submission_deadline)

    render locals: {
      week: week,
      current_submission_deadline: current_submission_deadline,
      venues_without_current_change_order: venues_without_current_change_order,
      previous_submission_deadline: previous_submission_deadline,
      previous_submission_change_orders: previous_submission_change_orders
    }
  end

  def show
    deadline_date = date_from_params
    submission_deadline = ChangeOrderSubmissionDeadline.from_deadline_date(deadline_date).time

    change_orders = ChangeOrder.
      where('? = DATE(submission_deadline)', deadline_date)

    venues_without_change_orders = VenueWithoutChangeOrderQuery.new(
      change_orders: change_orders
    ).all

    render locals: {
      submission_deadline: submission_deadline,
      change_orders: change_orders,
      venues_without_change_orders: venues_without_change_orders
    }
  end

  def history
    pagination_relation = ChangeOrder.
      where('submission_deadline < ?', Time.now).
      order('submission_deadline DESC').
      group('submission_deadline').
      paginate(page: params[:page], per_page: 2)

    render locals: { pagination_relation: pagination_relation }
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
