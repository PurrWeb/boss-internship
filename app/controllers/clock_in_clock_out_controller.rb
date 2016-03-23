class ClockInClockOutController < ApplicationController
  def index
    authorize! :manage, :clock_in_clock_out
  end
end
