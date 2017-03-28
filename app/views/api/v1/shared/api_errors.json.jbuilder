json.errors do
  api_errors.errors.each do |key, key_errors|
    json.set!(key, key_errors)
  end
end
