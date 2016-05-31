json.status clock_in_day.current_clock_in_state
json.hours_acceptance_period do
  json.partial! 'api/v1/shared/hours_acceptance_period.json', locals: { hours_acceptance_period: hours_acceptance_period }
end
hours_acceptance_breaks = hours_acceptance_period.hours_acceptance_breaks.enabled
json.hours_acceptance_breaks hours_acceptance_breaks do |hours_acceptance_break|
  json.partial! 'api/v1/shared/hours_acceptance_break.json', locals: { hours_acceptance_break: hours_acceptance_break }
end
