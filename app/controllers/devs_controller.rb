class DevsController < ApplicationController
  before_action :authorize_admin
  before_action :set_new_layout
  
  private
  def authorize_admin
    authorize! :manage, :admin
  end
end
