json.id clock_in_period.id
if clock_in_period.clock_in_period_reason.present?
  json.clock_in_period_reason do
    json.id clock_in_period.clock_in_period_reason.id
  end
else
  json.clock_in_period_reason nil
end
json.reason_note clock_in_period.reason_note
json.starts_at clock_in_period.starts_at
json.ends_at clock_in_period.ends_at
json.clock_in_day do
  json.id clock_in_period.clock_in_day.id
end
