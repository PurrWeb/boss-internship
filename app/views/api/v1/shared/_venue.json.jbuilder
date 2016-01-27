json.id venue.id
json.url api_v1_venue_url(venue)
json.name venue.name
json.staff_members venue.staff_members do |staff_member|
  json.id staff_member.id
  json.url api_v1_staff_member_url(staff_member)
end
