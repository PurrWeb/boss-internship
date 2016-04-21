class APIController < ApplicationController
  skip_before_filter :authenticate_user!
  before_filter :parse_access_token

  def parse_access_token
    token = nil
    authenticate_or_request_with_http_token do |supplied_token, other_options|
      token = AccessToken.find_by(token: supplied_token)
    end
    if token && (token.expires_at.nil? || token.expires_at > Time.current)
      @_access_token = token
    end
    @_access_token.present?
  end

  def api_token_athenticate!
    render(
      json: { errors: "Not authenticated" },
      status: :unauthorized
    ) unless @_access_token && @_access_token.api?
  end

  def staff_member_from_token
    @_access_token.staff_member
  end

  def current_user
    @_access_token.user
  end

  def web_token_authenticate!
    render(
      json: { errors: "Not authenticated" },
      status: :unauthorized
    ) unless @_access_token && @_access_token.web?
  end

  def current_ability
    if @_access_token && @_access_token.web?
      @current_ability ||= Ability.new(@_access_token.user)
    elsif @_access_token && @_access_token.api?
      @current_ability ||= ApiAbility.new(@_access_token.staff_member)
    end
  end
end
