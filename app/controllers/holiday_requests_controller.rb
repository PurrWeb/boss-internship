class HolidayRequestsController < ApplicationController
  before_action :set_new_layout

  def index
    authorize!(:view, :holiday_requests_page)

    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!
    render locals: { access_token: access_token }
  end
end
