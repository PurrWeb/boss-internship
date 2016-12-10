module Clock
  class ClockInClockOutController < ApplicationController
    skip_before_filter :authenticate_user!

    def index
      render locals: {}
    end

    # disables naviation in layout
    def render_navigation?
      false
    end
  end
end
