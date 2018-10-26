class Api::V1::VenueDashboardForecastsController < APIController
  before_filter :web_token_authenticate!

  def show
    venue = AccessibleVenuesQuery.new(current_user).all.find_by!(id: params.fetch(:id))

    current_forecast = ForecastIO.forecast(
      venue.latitude,
      venue.longitude,
      params: {
        units: "uk2",
        exclude: "minutely,hourly,alerts,flags",
      },
    )

    time_forecast = ForecastIO.forecast(
      venue.latitude,
      venue.longitude,
      time: Time.current.to_i,
      params: {
        units: "uk2",
        exclude: "currently,minutely,daily,alerts,flags",
      },
    )

    render json: {current: current_forecast, time: time_forecast}, status: 200
  end
end
