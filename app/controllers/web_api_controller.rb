class WebAPIController < APIController
  before_filter :web_token_authenticate!

  def current_user
    @_access_token.user
  end

  def web_token_authenticate!
    render(
      json: { errors: "Not authenticated" },
      status: :unauthorized
    ) unless current_user.present?
  end
end
