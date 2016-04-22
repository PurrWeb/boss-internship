module HeaderHelpers
  def set_token_header(token)
    header 'Authorization', "Token token=\"#{token.token}\""
  end
end
