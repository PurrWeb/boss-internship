class WtlClientsController < ApplicationController
  before_action :set_new_layout, only: [:index]

  def index
    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!

    render locals: {
      access_token: access_token.token,
      universities: WtlClient::UNIVERSITIES,
    }
  end
end
