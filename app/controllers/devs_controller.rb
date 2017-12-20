class DevsController < ApplicationController
  before_action :authorize_dev_only
  before_action :set_new_layout

  def secruity_app_sse_test
  end

  private
  def authorize_dev_only
    authorize! :manage, :dev_only_pages
  end
end
