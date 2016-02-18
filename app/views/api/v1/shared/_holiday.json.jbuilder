json.id holiday.id
json.url api_v1_holiday_url(holiday)
json.start_date holiday.start_date.iso8601
json.end_date holiday.end_date.iso8601
json.holiday_type holiday.holiday_type
json.status holiday.current_state
json.days holiday.days
json.staff_member do
  json.id holiday.staff_member.id
  json.url api_v1_staff_member_url(holiday.staff_member)
end
