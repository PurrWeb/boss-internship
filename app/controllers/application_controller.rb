class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_filter :authenticate_user!
  before_filter :set_default_layout

  before_filter :set_paper_trail_whodunnit
  before_filter :set_host
  before_filter :bundle_script

  helper_method [:render_navigation?, :render_v2_layout?]

  def current_user
    @current_user ||= super && User.includes(:email_address).find(@current_user.id)
  end

  def set_default_layout
    @current_layout = 'oldLayout';
  end

  def set_new_layout
    @current_layout = 'newLayout';
  end

  def render_navigation?
    true
  end

  def render_v2_layout?
    @current_layout != 'oldLayout'
  end

  def set_host
    Rails.application.routes.default_url_options[:host] = request.host
  end

  def bundle_script
    @bundle_script = SourcemapHelper.script_path
  end
end
