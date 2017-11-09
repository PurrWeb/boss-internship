module HeaderHelpers
  def set_authorization_header(value)
    header 'Authorization', "Token token=\"#{value}\""
  end

  def token_header(user, expires_at = 30.minutes.from_now)
    { 'Authorization' => "Token token=\"#{access_token_for(user, expires_at).token}\"" }
  end

  def invalid_token_header
    { 'Authorization' => "Token token=" }
  end

  def access_token_for(user, expires_at)
    WebApiAccessToken.new(expires_at: expires_at, user: user).persist!
  end

  def revoke_token_for(user)
    WebApiAccessToken.revoke!(user: user)
  end
end
