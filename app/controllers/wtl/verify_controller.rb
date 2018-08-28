module Wtl
  class VerifyController < ApplicationController
    skip_before_filter :authenticate_user!

    def verify
      render locals: {}
    end

    # disables naviation in layout
    def render_navigation?
      false
    end
  end
end
