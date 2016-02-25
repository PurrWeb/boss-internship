module Api
  module V1
    class RotaForecastsController < APIController
      def show
        rota = Rota.find_or_initialize_by(
          date: rota_date_from_params,
          venue: venue_from_params
        )
        authorize! :manage, rota

        rota_forecast = RotaForecast.where(rota: rota).first
        rota_forecast ||= GenerateRotaForecast.new(
          forecasted_take: Money.new(0),
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

        forecasted_take = forecasted_take_from_params
        curret_forecast = RotaForecast.where(rota: rota).first
        if curret_forecast && curret_forecast.forecasted_take == forecasted_take
          render "show", locals: { rota_forecast: curret_forecast }
        else
          rota_forecast = nil
          ActiveRecord::Base.transaction do
            if !rota.persisted?
              rota.update_attributes(creator: current_user)
            end

           rota_forecast = GenerateRotaForecast.new(
              forecasted_take: forecasted_take,
              rota: rota
            ).call

            rota_forecast.save!
          end

          render "show", locals: { rota_forecast: rota_forecast }
        end
      end

      private
      def venue_from_params
        Venue.find(params.fetch(:venue_id))
      end

      def rota_date_from_params
        UIRotaDate.parse(params.fetch(:id))
      end

      def forecasted_take_from_params
        Money.from_amount(
          Float(params.fetch(:forecasted_take))
        )
      end
    end
  end
end
