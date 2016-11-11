class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_filter :authenticate_user!

  before_filter :set_paper_trail_whodunnit

  helper_method :render_navigation?

  def current_user
    @current_user ||= super && User.includes(:email_address).find(@current_user.id)
  end

  def render_navigation?
    true
  end
end
