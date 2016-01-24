class APIController < ApplicationController
  skip_before_filter :authenticate_user!
  before_filter :api_authenticate_user!

  private
  def api_authenticate_user!
    warden_session_key = session["warden.user.user.key"].try(:last)
    if warden_session_key.present?
      warden.authenticate!(warden_session_key)
    end

    render(
      json: { errors: "Not authenticated" },
      status: :unauthorized
    ) unless current_user.present?
  end
end
