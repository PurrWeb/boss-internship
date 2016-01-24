json.errors do
  rota_shift.errors.messages.each do |key, messages|
    json.set!(key, messages)
  end
end
