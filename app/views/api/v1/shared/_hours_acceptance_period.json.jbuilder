json.id hours_acceptance_period.id
json.clock_in_day do
  json.id hours_acceptance_period.clock_in_day.id
end
json.starts_at hours_acceptance_period.starts_at.iso8601
json.ends_at hours_acceptance_period.ends_at.iso8601
json.status hours_acceptance_period.status
json.hours_acceptance_breaks hours_acceptance_period.hours_acceptance_breaks.enabled do |hours_acceptance_break|
  json.id hours_acceptance_break.id
end
json.hours_acceptance_reason do
  if hours_acceptance_period.hours_acceptance_reason.present?
    json.id hours_acceptance_period.hours_acceptance_reason.id
  else
    json.id HoursAcceptanceReason.none.id
  end
end
json.reason_note hours_acceptance_period.reason_note