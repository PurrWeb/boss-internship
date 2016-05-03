class ClockInClockOutController < ApplicationController
  def index
    authorize! :manage, :clock_in_clock_out
    render locals: {}
  end
end
