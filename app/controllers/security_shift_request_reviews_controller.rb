class SecurityShiftRequestReviewsController < ApplicationController
  before_action :set_new_layout

  def index
    return redirect_to(security_shift_request_review_path(show_redirect_params))
  end

  def show
    unless show_params_present?
      return redirect_to(security_shift_request_review_path(show_redirect_params))
    end

    date = date_from_params
    week = RotaWeek.new(date)

    access_token = current_user.current_access_token ||
                    WebApiAccessToken.new(user: current_user).persist!

    security_shift_requests = InRangeQuery.new({
                                relation: SecurityShiftRequest.all,
                                start_value: week.start_date,
                                end_value: week.end_date,
                              }).all
    assigned_security_shift_requests = security_shift_requests.in_state(:assigned)
    rota_shifts = RotaShift
                    .joins(:security_shift_request)
                    .where(security_shift_requests: {id: assigned_security_shift_requests})

    venues = Venue.joins(:security_shift_requests).distinct
    render locals: {
      access_token: access_token.token,
      date: date,
      security_shift_requests: security_shift_requests,
      rota_shifts: rota_shifts,
      start_date: week.start_date,
      end_date: week.end_date,
      venues: venues,
    }
  end

  private

  def date_from_params
    UIRotaDate.parse(params[:id]) if params[:id].present?
  end

  def show_redirect_params
    date = date_from_params || default_date
    {
      id: UIRotaDate.format(date),
    }
  end

  def show_params_present?
    date_from_params.present?
  end

  def default_date
    RotaWeek.new(RotaShiftDate.to_rota_date(Time.current)).start_date
  end

end
