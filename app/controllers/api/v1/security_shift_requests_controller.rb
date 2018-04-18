module Api
  module V1
    class SecurityShiftRequestsController < APIController
      before_filter :web_token_authenticate!

      def create
        result = SecurityShiftRequestApiService.new(
          requester: current_user,
          security_shift_request: SecurityShiftRequest.new,
        ).create(security_request_data_from_params)

        if result.success?
          render(
            json: result.security_shift_request,
            serializer: Api::V1::SecurityShiftRequests::SecurityShiftRequestSerializer,
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def update
        security_shift_request = security_request_from_params

        result = SecurityShiftRequestApiService.new(
          requester: current_user,
          security_shift_request: security_shift_request,
        ).update(security_request_data_from_params)

        if result.success?
          render(
            json: result.security_shift_request,
            serializer: Api::V1::SecurityShiftRequests::SecurityShiftRequestSerializer,
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def accept
        security_shift_request = security_request_from_params

        result = SecurityShiftRequestApiService.new(
          requester: current_user,
          security_shift_request: security_shift_request,
        ).accept

        if result.success?
          render(
            json: result.security_shift_request,
            serializer: Api::V1::SecurityShiftRequests::SecurityShiftRequestSerializer,
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def reject
        security_shift_request = security_request_from_params

        result = SecurityShiftRequestApiService.new(
          requester: current_user,
          security_shift_request: security_shift_request,
        ).reject

        if result.success?
          render(
            json: result.security_shift_request,
            serializer: Api::V1::SecurityShiftRequests::SecurityShiftRequestSerializer,
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def undo
        security_shift_request = security_request_from_params

        result = SecurityShiftRequestApiService.new(
          requester: current_user,
          security_shift_request: security_shift_request,
        ).undo

        if result.success?
          render(
            json: result.security_shift_request,
            serializer: Api::V1::SecurityShiftRequests::SecurityShiftRequestSerializer,
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def assign

      end

      private

      def security_request_data_from_params
        {
          starts_at: params.fetch(:startsAt),
          ends_at: params.fetch(:endsAt),
          note: params.fetch(:note),
          venue: venue_from_params,
        }
      end

      def security_request_from_params
        SecurityShiftRequest.find(params.fetch(:id))
      end

      def accessible_venues
        AccessibleVenuesQuery.new(current_user).all
      end

      def venue_from_params
        accessible_venues.find_by(id: params.fetch(:venueId))
      end

    end
  end
end
