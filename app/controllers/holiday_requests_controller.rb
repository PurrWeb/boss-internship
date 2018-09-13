class HolidayRequestsController < ApplicationController
  before_action :set_new_layout

  def index
    # authorize!(:view, :holiday_requests_page)
    pending_holiday_requests = HolidayRequest
      .includes([:staff_member, creator: [:name]])
      .in_state(:pending)
    staff_members = StaffMember
      .includes([:name, :staff_type, :master_venue])
      .joins(:holiday_requests)
      .where({ holiday_requests: { id: pending_holiday_requests.pluck(:id) } })
      .distinct

    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!
    render locals: {
      access_token: access_token.token,
      holiday_requests: pending_holiday_requests,
      staff_members: staff_members,
      permissionsData: HolidayRequestPagePermissions.new(
        holiday_requests: pending_holiday_requests,
        requester: current_user
      )
    }
  end
end
