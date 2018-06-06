class PaymentUploadsController < ApplicationController
  before_action :set_new_layout

  def index
    access_token = WebApiAccessToken.new(user: current_user).persist!
    render locals: { access_token: access_token }
  end
end
