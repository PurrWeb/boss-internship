ForecastIO.configure do |c|
  if Rails.configuration.use_darksky_api
    c.api_key = ENV.fetch('DARKSKY_API_KEY')
  end
end
