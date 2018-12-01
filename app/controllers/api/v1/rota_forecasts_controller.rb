module Api
  module V1
    class RotaForecastsController < APIController
      before_filter :web_token_authenticate!

      def show
        rota = Rota.find_or_initialize_by(
          date: rota_date_from_params,
          venue: venue_from_params
        )
        authorize! :manage, rota

        rota_forecast = RotaForecast.where(rota: rota).last
        rota_forecast ||= GenerateRotaForecast.new(
          forecasted_take_cents: 0,
          rota: rota
        ).call

        render locals: { rota_forecast: rota_forecast }
      end

      def update
        rota = Rota.find_or_initialize_by(
          date: rota_date_from_params,
          venue: venue_from_params
        )
        authorize! :manage, rota

        if !rota.forecastable?
          render(
            json: {
              errors: {
                base: ['Forecasts in the past cannot be updated']
              }
            },
            status: :forbidden
          )
        else
          forecasted_take_cents = forecasted_take_cents_from_params
          curret_forecast = RotaForecast.where(rota: rota).last
          if curret_forecast && curret_forecast.forecasted_take_cents == forecasted_take_cents
            render "show", locals: { rota_forecast: curret_forecast }
          else
            rota_forecast = nil
            ActiveRecord::Base.transaction do
              if !rota.persisted?
                rota.update_attributes(creator: current_user)
              end

             rota_forecast = GenerateRotaForecast.new(
                forecasted_take_cents: forecasted_take_cents,
                rota: rota
              ).call

              rota_forecast.save!
            end

            render "show", locals: { rota_forecast: rota_forecast }
          end
        end
      end

      def weekly
        date = rota_date_from_params
        week = RotaWeek.new(date)
        venue = venue_from_params

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

        weekly_forecast = GenerateWeeklyRotaForecast.new(
          rota_forecasts: rota_forecasts,
          week: week
        ).call

        render json: {
          weekly_rota_forecast: Api::V1::WeeklyRotaForecastSerializer.new(weekly_forecast, scope: { week: week })
        }
      end

      private
      def venue_from_params
        Venue.find(params.fetch(:venue_id))
      end

      def rota_date_from_params
        UIRotaDate.parse(params.fetch(:id))
      end

      def forecasted_take_cents_from_params
        params.fetch(:forecasted_take_cents)
      end
    end
  end
end
