class WelcomeController < ApplicationController
  def index
    redirect_to current_user.root_redirect_path
  end
end
