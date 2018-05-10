class SecurityVenuesController < ApplicationController
  before_action :set_new_layout

  def index
    authorize!(:view, :security_venues)

    render locals: {}
  end
end
