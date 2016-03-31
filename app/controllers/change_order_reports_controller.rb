class ChangeOrderReportsController < ApplicationController
  before_action :authorize_admin

  def index
    if date_from_params.present? && date_from_params_valid?
      date = date_from_params
      week = RotaWeek.new(date)
      deadline = ChangeOrderSubmissionDeadline.new(week: week)

      venues_without_change_orders = VenueWithoutChangeOrderQuery.new(
        date: date
      ).all

      change_orders = InRangeQuery.new(
        relation: ChangeOrder.all,
        start_value: week.start_date,
        end_value: week.end_date,
        start_column_name: 'date',
        end_column_name: 'date'
      ).all

      render locals: {
        week: week,
        venues_without_change_orders: venues_without_change_orders,
        change_orders: change_orders,
        deadline: deadline
      }
    else
      redirect_to(change_order_reports_path(index_redirect_params))
    end
  end

  private
  def authorize_admin
    authorize! :manage, :admin
  end

  def index_redirect_params
    week = RotaWeek.new(date_from_params || Time.now)

    {
      date: UIRotaDate.format(week.start_date)
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
end
