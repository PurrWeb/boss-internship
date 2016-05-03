json.staff_member do
  json.id clock_in_status.staff_member.id
  json.url api_v1_staff_member_url(clock_in_status.staff_member)
end
json.status clock_in_status.current_state
