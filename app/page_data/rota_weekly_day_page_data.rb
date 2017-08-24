class RotaWeeklyDayPageData
  def initialize(date:, venue:)
    @date = date
    @venue = venue
  end

  attr_reader :date, :venue
  
  def serialize
    week = RotaWeek.new(date)
    rota = Rota.find_or_initialize_by(
      date: date,
      venue: venue
    )
    ActiveRecord::Associations::Preloader.new.preload(
      rota, [:enabled_rota_shifts, :venue]
    )

    forecast = RotaForecast.where(rota: rota).last

    rota_forecast = if forecast.present?
      forecast
    else
      GenerateRotaForecast.new(
        forecasted_take_cents: 0,
        rota: rota
      ).call
    end

    weekly_rota_forecast = GenerateWeeklyRotaForecast.new(
      rota_forecasts: [rota_forecast],
      week: week
    ).call

    {
      venue: venue,
      start_date: week.start_date,
      end_date: week.end_date,
      rota_weekly_day: Api::V1::RotaOverviewSerializer.new(rota, scope: { staff_types: StaffType.all }),
      rota_forecast: Api::V1::RotaForecastSerializer.new(rota_forecast),
      weekly_rota_forecast: Api::V1::WeeklyRotaForecastSerializer.new(weekly_rota_forecast, scope: { week: week })
    }
  end
end
