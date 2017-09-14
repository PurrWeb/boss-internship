class CleanupForecastsJob < ActiveJob::Base
  def perform
    RotaForecast.joins(:four_week_old_rotas).delete_all
  end
end
