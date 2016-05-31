json.array! hours_acceptance_reasons do |hours_acceptance_reason|
  json.partial! 'api/v1/shared/hours_acceptance_reason.json', locals: { hours_acceptance_reason: hours_acceptance_reason }
end
