json.id rota_forecast.id
json.url api_v1_venue_rota_forecast_url(
  venue_id: rota_forecast.venue.id,
  id: UIRotaDate.format(rota_forecast.date)
)
json.venue do
  json.id rota_forecast.venue.id
  json.url api_v1_venue_url(rota_forecast.venue)
end
json.date rota_forecast.date.iso8601
json.forecasted_take Float(rota_forecast.forecasted_take.to_s)
json.total Float(rota_forecast.total.to_s)
json.total_percentage rota_forecast.total_percentage
json.staff_total Float(rota_forecast.staff_total.to_s)
json.staff_total_percentage rota_forecast.staff_total_percentage
json.pr_total Float(rota_forecast.pr_total.to_s)
json.pr_total_percentage rota_forecast.pr_total_percentage
json.kitchen_total Float(rota_forecast.kitchen_total.to_s)
json.kitchen_total_percentage rota_forecast.kitchen_total_percentage
json.security_total Float(rota_forecast.security_total.to_s)
json.security_total_percentage rota_forecast.security_total_percentage
