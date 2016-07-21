class GenerateWeeklyRotaForecast
  def initialize(week:, venue:)
    @week = week
    @venue = venue
  end

  def call
    forecasted_take_cents = 0
    total_cents = 0
    staff_total_cents = 0
    pr_total_cents = 0
    kitchen_total_cents = 0
    security_total_cents = 0
    overhead_total_cents = 0

    (week.start_date..week.end_date).each do |date|
      rota = Rota.find_or_initialize_by(
        date: date,
        venue: venue
      )
      forecast = RotaForecast.where(rota: rota).last

      if !forecast.present?
        forecast = GenerateRotaForecast.new(
          forecasted_take_cents: 0,
          rota: rota
        ).call
      end

      forecasted_take_cents = forecasted_take_cents + forecast.forecasted_take_cents
      total_cents = total_cents + forecast.total_cents
      staff_total_cents = staff_total_cents + forecast.staff_total_cents
      pr_total_cents = pr_total_cents + forecast.pr_total_cents
      kitchen_total_cents = kitchen_total_cents + forecast.kitchen_total_cents
      security_total_cents = security_total_cents + forecast.security_total_cents
      overhead_total_cents = overhead_total_cents + forecast.overhead_total_cents
    end

    WeeklyRotaForecast.new(
      week: week,
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
  attr_reader :week, :venue
end
