json.id rota_shift.id
json.url api_v1_rota_shift_url(rota_shift)
json.rota do
  json.id rota_shift.rota.id
  json.url api_v1_rota_url(rota_shift.rota)
end
json.starts_at rota_shift.starts_at.iso8601
json.ends_at rota_shift.ends_at.iso8601
json.staff_member do
  json.id rota_shift.staff_member.id
  json.url api_v1_staff_member_url(rota_shift.staff_member)
end
