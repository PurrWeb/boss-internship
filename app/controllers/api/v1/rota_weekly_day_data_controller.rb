module Api
  module V1
    class RotaWeeklyDayDataController < APIController
      before_filter :web_token_authenticate!

      def index
        if required_rota_weekly_day_fields_present?
          date = date_from_params
          venue = venue_from_params
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

          render json: {
            accessible_venues: accessible_venues_for(current_user),
            currentVenue: venue,
            start_date: week.start_date,
            end_date: week.end_date,
            rota: rota,
            staff_types: StaffType.all,
            rota_forecast: rota_forecast,
            week: week,
            weekly_rota_forecast: weekly_rota_forecast
          }, status: 200
        else
          render json: { }, status: 422
        end
      end

      private
      def date_from_params
        if params[:date].present?
          UIRotaDate.parse(params[:date])
        end
      end

      def venue_from_params
        if current_user.has_all_venue_access?
          Venue.find_by({id: params.fetch(:venue_id)})
        else
          current_user.venues.find(params.fetch(:venue_id))
        end
      end

      def accessible_venues_for(user)
        AccessibleVenuesQuery.new(user).all
      end
    
      def required_rota_weekly_day_fields
        ["date", "venue_id"]
      end

      def required_rota_weekly_day_fields_present?
        required_rota_weekly_day_fields.all? do |field|
          params.keys.include?(field)
        end
      end
    end
  end
end
