class GenerateWeeklyRotaForecast
  def initialize(week:, venue:)
    @week = week
    @venue = venue
  end

  def call
    forecasted_take = Money.new(0)
    total = Money.new(0)
    staff_total = Money.new(0)
    pr_total = Money.new(0)
    kitchen_total = Money.new(0)
    security_total = Money.new(0)

    (week.start_date..week.end_date).each do |date|
      rota = Rota.find_or_initialize_by(
        date: date,
        venue: venue
      )
      forecast = RotaForecast.where(rota: rota).last

      if !forecast.present?
        forecast = GenerateRotaForecast.new(
          forecasted_take: Money.new(0),
          rota: rota
        ).call
      end

      forecasted_take = forecasted_take + forecast.forecasted_take
      total = total + forecast.total
      staff_total = staff_total + forecast.staff_total
      pr_total = pr_total + forecast.pr_total
      kitchen_total = kitchen_total + forecast.kitchen_total
      security_total = security_total + forecast.security_total
    end

    WeeklyRotaForecast.new(
      week: week,
      forecasted_take: forecasted_take,
      total: total,
      staff_total: staff_total,
      pr_total: pr_total,
      kitchen_total: kitchen_total,
      security_total: security_total
    )
  end

  private
  attr_reader :week, :venue
end
