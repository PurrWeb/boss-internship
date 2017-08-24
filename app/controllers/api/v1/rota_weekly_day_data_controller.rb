module Api
  module V1
    class RotaWeeklyDayDataController < APIController
      before_filter :web_token_authenticate!

      def index
        if required_rota_weekly_day_fields_present?
          date = date_from_params
          venue = venue_from_params
          rota_weekly_day_data = RotaWeeklyDayPageData.new(date: date, venue: venue).serialize

          render json: {
            accessible_venues: accessible_venues_for(current_user),
          }.merge(rota_weekly_day_data), status: 200
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
