json.errors do
  checklist.errors.messages.each do |key, messages|
    json.set!(key, messages)
  end
end
