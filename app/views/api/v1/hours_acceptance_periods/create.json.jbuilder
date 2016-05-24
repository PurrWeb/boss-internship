json.array! Array(hours_acceptance_period) do |hours_acceptance_period|
  json.partial! template: 'api/v1/shared/_hours_acceptance_period', locals: { hours_acceptance_period: hours_acceptance_period }
end
json.array! hours_acceptance_period.hours_acceptance_breaks.enabled do |hours_acceptance_break|
  json.partial! 'api/v1/shared/hours_acceptance_break.json', locals: { hours_acceptance_break: hours_acceptance_break }
end
