class SecurityShiftRequestsController < ApplicationController
  before_action :set_new_layout

  def index
    return redirect_to(security_shift_request_path(show_redirect_params))
  end

  def show
    unless show_params_present?
      return redirect_to(security_shift_request_path(show_redirect_params))
    end
    authorize! :view, :security_shift_requests

    date = date_from_params
    week = RotaWeek.new(date)

    access_token = current_user.current_access_token ||
                    WebApiAccessToken.new(user: current_user).persist!

    security_shift_requests = InRangeQuery.new({
                                relation: venue_from_params.security_shift_requests.includes([:created_shift, :creator]),
                                start_value: week.start_date,
                                end_value: week.end_date,
                              }).all
    assigned_security_shift_requests = security_shift_requests.in_state(:assigned)
    rota_shifts = RotaShift
                    .joins(:security_shift_request)
                    .where(security_shift_requests: {id: assigned_security_shift_requests})
                    .includes([:staff_member])
    staff_members = StaffMember
                      .where(id: rota_shifts.pluck(:staff_member_id).uniq)
                      .includes([:name, :staff_type])

    render locals: {
      access_token: access_token.token,
      date: date,
      security_shift_requests: security_shift_requests,
      rota_shifts: rota_shifts,
      start_date: week.start_date,
      end_date: week.end_date,
      staff_members: staff_members,
      current_venue: venue_from_params,
      permissions: SecurityShiftRequestsPermissions.new(
        current_user: current_user,
        shift_requests: security_shift_requests,
      ),
      can_create: current_user.has_effective_access_level?(AccessLevel.manager_access_level)
    }
  end

  private

  def accessible_venues
    AccessibleVenuesQuery.new(current_user).all
  end

  def date_from_params
    UIRotaDate.parse(params[:id]) if params[:id].present?
  end

  def show_redirect_params
    venue = venue_from_params || current_user.default_venue
    date = date_from_params || default_date
    {
      id: UIRotaDate.format(date),
      venue_id: venue.id
    }
  end

  def show_params_present?
    venue_from_params.present? &&
      date_from_params.present?
  end

  def venue_from_params
    accessible_venues.find_by(id: params[:venue_id])
  end

  def default_date
    RotaWeek.new(RotaShiftDate.to_rota_date(Time.current)).start_date
  end

end
