json.id rota.id
if rota.persisted?
  json.url api_v1_rota_url(rota)
else
  json.url nil
end
json.venue do
  json.id rota.venue.id
  json.url api_v1_venue_url(rota.venue)
end
json.date rota.date.iso8601
json.status rota.status
