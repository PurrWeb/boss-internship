json.array! rota_forecasts do |rota_forecast|
  json.partial! 'api/v1/shared/rota_forecast.json', locals: { rota_forecast: rota_forecast }
end
