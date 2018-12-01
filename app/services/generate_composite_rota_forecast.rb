# Takes a list of rota_forecasts and uses them to create one that is the combination
# of their values
class GenerateCompositeRotaForecast
  def initialize(rota_forecasts:)
    @rota_forecasts = rota_forecasts
  end

  def call
    forecasted_take_cents = 0
    total_cents = 0
    staff_total_cents = 0
    pr_total_cents = 0
    kitchen_total_cents = 0
    security_total_cents = 0
    overhead_total_cents = 0

    #Ensure all forcasts supplied are in the same week
    rota_week = RotaWeek.new(
      rota_forecasts.first.date
    )
    if rota_forecasts.any? { |rota_forecast| rota_week != RotaWeek.new(rota_forecast.date) }
      raise 'All supplied forcasts must be in the same week'
    end
    venue = rota_forecasts.first.rota.venue
    if rota_forecasts.any? { |rota_forecast| venue.id != rota_forecast.rota.venue.id }
      raise 'All supplied forecasts must be for the same venue'
    end

    rota_forecasts.each do |rota_forecast|
      forecasted_take_cents = forecasted_take_cents + rota_forecast.forecasted_take_cents
      total_cents = total_cents + rota_forecast.total_cents
      staff_total_cents = staff_total_cents + rota_forecast.staff_total_cents
      pr_total_cents = pr_total_cents + rota_forecast.pr_total_cents
      kitchen_total_cents = kitchen_total_cents + rota_forecast.kitchen_total_cents
      security_total_cents = security_total_cents + rota_forecast.security_total_cents
      overhead_total_cents = overhead_total_cents + rota_forecast.overhead_total_cents
    end

    CompositeRotaForecast.new(
      venue: venue,
      week_start: rota_week.start_date,
      forecasted_take_cents: forecasted_take_cents,
      total_cents: total_cents,
      overhead_total_cents: overhead_total_cents,
      staff_total_cents: staff_total_cents,
      pr_total_cents: pr_total_cents,
      kitchen_total_cents: kitchen_total_cents,
      security_total_cents: security_total_cents
    )
  end

  private
  attr_reader :rota_forecasts
end
