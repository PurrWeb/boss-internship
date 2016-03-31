class ChangeOrderReportsController < ApplicationController
  before_action :authorize_admin

  def index
    date = Time.now.to_date
    week = RotaWeek.new(date)
    submission_deadline = ChangeOrderSubmissionDeadline.new(week: week).time

    change_orders = ChangeOrder.
      where(submission_deadline: submission_deadline)

    venues_without_change_orders = VenueWithoutChangeOrderQuery.new(
      change_orders: change_orders
    ).all

    render locals: {
      week: week,
      submission_deadline: submission_deadline,
      venues_without_change_orders: venues_without_change_orders,
      change_orders: change_orders
    }
  end

  private
  def authorize_admin
    authorize! :manage, :admin
  end
end
