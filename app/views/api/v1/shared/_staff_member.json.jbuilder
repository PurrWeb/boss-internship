json.id staff_member.id
json.url api_v1_staff_member_url(staff_member)
json.avatar_url staff_member.avatar_url
json.staff_type do
  json.id staff_member.staff_type.id
  json.url api_v1_staff_type_url(staff_member.staff_type)
end
json.first_name staff_member.name.first_name
json.surname staff_member.name.surname
json.preferred_hours staff_member.hours_preference_note
json.preferred_days staff_member.day_perference_note
json.holidays staff_member.holidays.in_state(:enabled) do |holiday|
  json.id holiday.id
  json.url api_v1_holiday_url(holiday)
end
json.venue do
  json.id staff_member.venue && staff_member.venue.id
  json.url staff_member.venue && api_v1_venue_url(staff_member.venue)
end
