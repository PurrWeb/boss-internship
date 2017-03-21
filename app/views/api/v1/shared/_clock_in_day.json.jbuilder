json.id clock_in_day.id
json.date clock_in_day.date.iso8601
json.venue do
  json.id clock_in_day.venue_id
end
json.staff_member do
  json.id clock_in_day.staff_member_id
end
json.clock_in_notes clock_in_day.clock_in_notes do |clock_in_note|
  json.id clock_in_note.id
end
json.clock_in_periods clock_in_day.clock_in_periods do |clock_in_period|
  json.id clock_in_period.id
end
json.hours_acceptance_periods clock_in_day.hours_acceptance_periods do |hours_acceptance_period|
  json.id hours_acceptance_period.id
end
json.status clock_in_day.current_clock_in_state
