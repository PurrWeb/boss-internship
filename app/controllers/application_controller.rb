class ApplicationController < ActionController::Base
  require 'custom_pagination_link_renderer'

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_filter :authenticate_user!
  before_filter :set_default_layout

  before_filter :set_paper_trail_whodunnit
  before_filter :set_host
  before_filter :setup_frontend_bundles
  before_filter :set_current_venue_on_redis

  helper_method [:render_navigation?, :render_v2_layout?, :header_data, :show_global_venue?]

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

  def header_data
    PermissionsPageData.new(user: current_user).to_json
  end

  def render_v2_layout?
    @current_layout != 'oldLayout'
  end

  def set_host
    Rails.application.routes.default_url_options[:host] = request.host
  end

  def setup_frontend_bundles
    @frontend_bundles = SourcemapHelper.bundles
  end

  def render_not_found!
    render file: "#{Rails.root}/public/404.html", layout: false, status: 404
  end

  def set_current_venue_on_redis
    if params[:venue_id].present?
      CurrentVenueService.new(
        user: current_user,
        venue_id: params[:venue_id]
      ).set_current_venue
    end
  end

  def show_global_venue?
    true
  end

  def current_ability
    @current_ability ||= UserAbility.new(current_user)
  end

  def current_venue
    CurrentVenueService.new(user: current_user, venue_id: params[:venue_id]).venue
  end

  def camelized_collection_json(collection, serializer, scope = nil, deep_nest = nil)
    camelized_collection(collection, serializer, scope, deep_nest).to_json.html_safe
  end

  def camelized_collection(collection, serializer, scope = nil, deep_nest = nil)
    collection.map do |resource|
      ActiveModelSerializers::SerializableResource.new(
        resource,
        serializer: serializer,
        key_transform: :camel_lower,
        scope: scope,
        include: deep_nest
      ).as_json
    end
  end

  def camelized_serializer(resource, serializer, scope = nil, deep_nest = nil)
    a = ActiveModelSerializers::SerializableResource.new(
      resource,
      serializer: serializer,
      key_transform: :camel_lower,
      scope: scope,
      include: deep_nest
    ).as_json
  end
end
