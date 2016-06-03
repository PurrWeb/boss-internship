json.staff_members do
  json.array! staff_members do |staff_member|
    json.partial!('api/v1/shared/staff_member.json', locals: { staff_member: staff_member })
  end
end
json.clock_in_days do
  json.array! clock_in_days do |clock_in_day|
    json.partial! 'api/v1/shared/clock_in_day.json', locals: { clock_in_day: clock_in_day }
  end
end
json.clock_in_notes do
  json.array! clock_in_notes do |clock_in_note|
    json.partial! 'api/v1/shared/clock_in_note.json', locals: { clock_in_note: clock_in_note }
  end
end
json.staff_types do
  json.array! staff_types do |staff_type|
    json.partial! 'api/v1/shared/staff_type.json', locals: { staff_type: staff_type }
  end
end
json.rota_shifts do
  json.array! rota_shifts do |rota_shift|
    json.partial! 'api/v1/shared/rota_shift.json', locals: { rota_shift: rota_shift }
  end
end
json.venues do
  json.array! venues do |venue|
    json.partial! 'api/v1/shared/venue.json', locals: { venue: venue }
  end
end
json.rotas do
  json.array! rotas do |rota|
    json.partial! 'api/v1/shared/rota.json', locals: { rota: rota }
  end
end
json.page_data do
  json.rota_date rota_date.iso8601
  json.rota_venue_id venue.id
end
