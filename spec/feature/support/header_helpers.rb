module HeaderHelpers
  def set_authorization_header(value)
    header 'Authorization', "Token token=\"#{value}\""
  end
end
