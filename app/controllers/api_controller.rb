class APIController < ApplicationController
  skip_before_filter :verify_authenticity_token
  skip_before_filter :authenticate_user!
  skip_before_filter :set_paper_trail_whodunnit
  skip_before_filter :set_current_venue_on_redis
  
  before_filter :parse_access_tokens

  def parse_access_tokens
    api_token = nil
    web_token = nil
    authenticate_or_request_with_http_token do |supplied_token, other_options|
      api_token = ApiAccessToken.find_by_token(token: supplied_token)
      web_token = WebApiAccessToken.find_by_token(token: supplied_token)
      api_token || web_token
    end
    if api_token && (api_token.expires_at.nil? || api_token.expires_at > Time.current)
      @api_access_token = api_token
    end
    if web_token && (web_token.expires_at.nil? || web_token.expires_at > Time.current)
      @web_access_token = web_token
    end
  end
  
  def api_token_athenticate!
    render(
      json: { errors: "Not authenticated" },
      status: :unauthorized
    ) unless @api_access_token.present?
  end

  def web_token_authenticate!
    render(
      json: { errors: "Not authenticated" },
      status: :unauthorized
    ) unless @web_access_token.present?

    set_paper_trail_whodunnit
  end

  def staff_member_from_token
    @api_access_token.staff_member
  end

  def current_user
    if @web_access_token.present?
      @web_access_token.user
    end
  end

  def venue_from_api_key
    @api_access_token.andand.api_key.andand.venue
  end

  def current_ability
    if @web_access_token
      @current_ability ||= Ability.new(@web_access_token.user)
    elsif @api_access_token
      @current_ability ||= ApiAbility.new(@api_access_token.staff_member)
    end
  end
end
