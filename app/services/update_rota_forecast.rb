class UpdateRotaForecast
  def initialize(rota:)
    @rota = rota
  end

  def call
    return unless rota.forecastable?

    rota_forecast = RotaForecast.where(rota: rota).last
    forecasted_take_cents = (rota_forecast && rota_forecast.forecasted_take_cents) || 0
    GenerateRotaForecast.new(
      forecasted_take_cents: forecasted_take_cents,
      rota: rota
    ).call.save!
  end

  private
  attr_reader :rota
end
