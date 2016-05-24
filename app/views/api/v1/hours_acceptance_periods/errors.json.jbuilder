json.errors do
  hours_acceptance_period.errors.messages.each do |key, messages|
    json.set!(key, messages)
  end

  json.hours_acceptance_breaks do
    json.array! hours_acceptance_period.hours_acceptance_breaks.enabled do |hours_acceptance_break|
      hours_acceptance_break.errors.messages.each do |key, messages|
        json.set!(key, messages)
      end
    end
  end
end
