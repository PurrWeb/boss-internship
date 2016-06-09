json.status clock_in_day.current_clock_in_state
json.clock_in_period do
  json.partial! 'api/v1/shared/clock_in_period.json', locals: { clock_in_period: clock_in_period }
end
clock_in_breaks = clock_in_period.clock_in_breaks
json.clock_in_breaks clock_in_breaks do |clock_in_break|
  json.partial! 'api/v1/shared/clock_in_break.json', locals: { clock_in_break: clock_in_break }
end
clock_in_event = clock_in_period.clock_in_events.last
json.clock_in_event do
  json.partial! 'api/v1/shared/clock_in_event.json', locals: { clock_in_event: clock_in_event }
end
json.hours_acceptance_period do
  json.partial! 'api/v1/shared/hours_acceptance_period.json', locals: { hours_acceptance_period: hours_acceptance_period }
end
hours_acceptance_breaks = hours_acceptance_period.hours_acceptance_breaks.enabled
json.hours_acceptance_breaks hours_acceptance_breaks do |hours_acceptance_break|
  json.partial! 'api/v1/shared/hours_acceptance_break.json', locals: { hours_acceptance_break: hours_acceptance_break }
end
