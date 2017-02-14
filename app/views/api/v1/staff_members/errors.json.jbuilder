json.errors do
  staff_member.errors.each do |key, key_errors|
    json.set!(key, key_errors)
  end
end
