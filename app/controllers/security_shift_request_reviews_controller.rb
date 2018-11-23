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

    all_security_shift_requests = SecurityShiftRequest.all

    security_shift_requests = InRangeQuery.new({
      relation: all_security_shift_requests.includes([:created_shift, :creator, :security_shift_request_transitions]),
      start_value: RotaShiftDate.new(week.start_date).start_time,
      end_value: RotaShiftDate.new(week.end_date).end_time,
    }).all

    assigned_security_shift_requests = security_shift_requests.in_state(:assigned)

    rota_shifts = RotaShift.
      joins(:security_shift_request).
      where(security_shift_requests: {id: assigned_security_shift_requests}).
      includes([:staff_member, :rota])

    staff_members = StaffMember.
      where(id: rota_shifts.pluck(:staff_member_id).uniq).
      includes([:name, :staff_type])

    venues = Venue.joins(:security_shift_requests).distinct

    render locals: {
      access_token: access_token.token,
      date: date,
      security_shift_requests: security_shift_requests,
      rota_shifts: rota_shifts,
      start_date: week.start_date,
      end_date: week.end_date,
      staff_members: staff_members,
      venues: venues,
      permissions: SecurityShiftRequestsPermissions.new(
        current_user: current_user,
        shift_requests: security_shift_requests,
      ),
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
