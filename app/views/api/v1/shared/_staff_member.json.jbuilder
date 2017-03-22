json.id staff_member.id
json.url api_v1_staff_member_url(staff_member)
json.avatar_url staff_member.avatar_url
json.staff_type do
  json.id staff_member.staff_type_id
  json.url api_v1_staff_type_url(staff_member.staff_type)
end
json.first_name staff_member.name.first_name
json.surname staff_member.name.surname
json.preferred_hours staff_member.hours_preference_note
json.preferred_days staff_member.day_perference_note
venues = StaffMemberWorkableVenuesQuery.new(staff_member: staff_member).all
json.venues venues do |venue|
  json.id venue.id
  json.url api_v1_venue_url(venue)
end
