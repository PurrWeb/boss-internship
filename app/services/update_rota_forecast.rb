class UpdateRotaForecast
  def initialize(rota:)
    @rota = rota
  end

  def call
    return unless rota.forecastable?

    rota_forecast = RotaForecast.where(rota: rota).last
    forecasted_take = (rota_forecast && rota_forecast.forecasted_take) || Money.new(0)
    GenerateRotaForecast.new(
      forecasted_take: forecasted_take,
      rota: rota
    ).call.save!
  end

  private
  attr_reader :rota
end
