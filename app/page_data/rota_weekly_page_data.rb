class RotaWeeklyPageData
  def initialize(date:, venue:)
    @date = date
    @venue = venue
  end

  attr_reader :date, :venue, :rota_forecast, :week, :rota, :forecast, :weekly_rota_forecast
  
  def call
    @week = RotaWeek.new(date)
    @rota = Rota.find_or_initialize_by(
      date: date,
      venue: venue
    )
    ActiveRecord::Associations::Preloader.new.preload(
      rota, [:enabled_rota_shifts, :venue]
    )

    @forecast = RotaForecast.where(rota: rota).last

    @rota_forecast = if forecast.present?
      forecast
    else
      GenerateRotaForecast.new(
        forecasted_take_cents: 0,
        rota: rota
      ).call
    end

    @weekly_rota_forecast = GenerateWeeklyRotaForecast.new(
      rota_forecasts: [rota_forecast],
      week: week
    ).call
    
    self
  end
end
