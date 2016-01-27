json.id staff_member.id
json.url api_v1_staff_member_url(staff_member)
json.staff_type do
  json.id staff_member.staff_type.id
  json.url api_v1_staff_type_url(staff_member.staff_type)
end
json.first_name staff_member.name.first_name
json.surname staff_member.name.surname
json.preferred_hours staff_member.hours_preference_note
json.preferred_days staff_member.day_perference_note