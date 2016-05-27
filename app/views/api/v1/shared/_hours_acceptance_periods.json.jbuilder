json.array! hours_acceptance_periods do |hours_acceptance_period|
  json.partial! 'api/v1/shared/hours_acceptance_period.json', locals: { hours_acceptance_period: hours_acceptance_period }
end
