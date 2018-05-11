module Api
  module V1
    class SecurityVenuesController < ActionController::Base
      def create
        result = CreateSecurityVenueApiService.new({
          requester: current_user
        }).call(params: security_venue_params)

        if result.success?
          render(
            json: result.security_venue,
            serializer: Api::V1::SecurityVenues::SecurityVenueSerializer,
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def update
        result = UpdateSecurityVenueApiService.new({
          requester: current_user,
          security_venue: security_venue_from_params,
        }).call(params: security_venue_params)

        if result.success?
          render(
            json: result.security_venue,
            serializer: Api::V1::SecurityVenues::SecurityVenueSerializer,
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      private

      def security_venue_params
        {
          name: params.fetch(:name),
          address: params.fetch(:address),
          lat: params.fetch(:lat),
          lng: params.fetch(:lng)
        }
      end

      def security_venue_from_params
        SecurityVenue.find_by(id: params.fetch(:id))
      end
    end
  end
end
