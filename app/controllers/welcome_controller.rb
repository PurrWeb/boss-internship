class WelcomeController < ApplicationController
  def index
    redirect_to current_user.root_direct_path
  end
end
