json.array! hours_acceptance_breaks do |hours_acceptance_break|
  json.partial! 'api/v1/shared/hours_acceptance_break.json', locals: { hours_acceptance_break: hours_acceptance_break }
end
