json.clock_in_day do
  json.partial! 'api/v1/shared/clock_in_day.json', locals: { clock_in_day: clock_in_day }
end
json.clock_in_notes clock_in_day.clock_in_notes do |clock_in_note|
  json.partial! 'api/v1/shared/clock_in_note.json', locals: { clock_in_note: clock_in_note }
end
json.clock_in_periods clock_in_day.clock_in_periods do |clock_in_period|
  json.partial! 'api/v1/shared/clock_in_period.json', locals: { clock_in_period: clock_in_period }
end
clock_in_breaks = clock_in_day.clock_in_periods.map(&:clock_in_breaks).flatten
json.clock_in_breaks clock_in_breaks  do |clock_in_break|
  json.partial! 'api/v1/shared/clock_in_break.json', locals: { clock_in_break: clock_in_break }
end
json.hours_acceptance_periods clock_in_day.hours_acceptance_periods do |hours_acceptance_period|
  json.partial! 'api/v1/shared/hours_acceptance_period.json', locals: { hours_acceptance_period: hours_acceptance_period }
end
hours_acceptance_breaks = clock_in_day.hours_acceptance_periods.map(&:hours_acceptance_breaks).flatten
json.hours_acceptance_breaks hours_acceptance_breaks do |hours_acceptance_break|
  json.partial! 'api/v1/shared/hours_acceptance_break.json', locals: { hours_acceptance_break: hours_acceptance_break }
end
