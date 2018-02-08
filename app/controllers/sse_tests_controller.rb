class SseTestsController < ApplicationController
  before_action :set_new_layout

  def secruity_app_sse_test
    authorize! :view, :sse_tests
  end
end
