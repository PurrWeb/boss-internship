module Clock
  class ClockInClockOutController < ApplicationController
    skip_before_filter :authenticate_user!

    def index
      render locals: {}
    end
  end
end
