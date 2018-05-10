class SecurityVenuesController < ApplicationController
  before_action :set_new_layout

  def index
    render locals: {}
  end
end
