class WelcomeController < ApplicationController
  def index
    @current_layout = 'newLayout';
  end
  
  def render_v2_layout?
    true
  end
end
