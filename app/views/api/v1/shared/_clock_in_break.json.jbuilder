json.id clock_in_break.id
json.clock_in_period do
  json.id clock_in_break.clock_in_period.id
end
json.starts_at clock_in_break.starts_at.iso8601
json.ends_at clock_in_break.ends_at.iso8601
