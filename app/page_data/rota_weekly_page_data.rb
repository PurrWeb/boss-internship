class RotaWeeklyPageData
  def initialize(date:, venue:)
    @date = date
    @venue = venue
  end

  attr_reader :date, :venue, :rota_forecast, :week, :rota, :forecast
  
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
    self
  end

  def weekly_rota_forecasts
    @week = RotaWeek.new(date)
    
    rotas = (week.start_date..week.end_date).map do |date|
      Rota.find_or_initialize_by(
        date: date,
        venue: venue
      )
    end

    rota_forecasts = rotas.map do |rota|
      forecast = RotaForecast.where(rota: rota).last

      if !forecast.present?
        forecast = GenerateRotaForecast.new(
          forecasted_take_cents: 0,
          rota: rota
        ).call
      end

      forecast
    end

    weekly_forecasts = GenerateWeeklyRotaForecast.new(
      rota_forecasts: rota_forecasts,
      week: week
    ).call
  end  
end
