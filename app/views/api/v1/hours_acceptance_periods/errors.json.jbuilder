json.errors do
  hours_acceptance_period.errors.messages.each do |key, messages|
    next if key == :hours_acceptance_breaks
    json.set!(key, messages)
  end

  json.hours_acceptance_breaks do
    json.array! hours_acceptance_breaks do |hours_acceptance_break|
      json.id hours_acceptance_break.id
      hours_acceptance_break.errors.messages.each do |key, messages|
        json.set!(key, messages)
      end
    end
  end
end
