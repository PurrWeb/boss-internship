module Api
  module V1
    class SecurityVenueShiftsController < APIController
      before_filter :web_token_authenticate!

      def create
        authorize! :create, :security_venue_shifts
        frontend_updates = FrontendUpdates.new
        result = CreateSecurityVenueShift.new(
          creator: current_user,
          date: rota_date_from_params,
          venue: security_venue_from_params,
          security_venue_shift_params: {
            starts_at: security_venue_shift_params.fetch(:startsAt),
            ends_at: security_venue_shift_params.fetch(:endsAt),
            staff_member: security_venue_shift_params.fetch(:staff_member),
          },
          frontend_updates: frontend_updates,
        ).call

        if result.success?
          frontend_updates.dispatch
          render(
            json: result.security_venue_shift,
            serializer: Api::V1::SecurityRota::SecurityVenueShiftSerializer,
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def update
        authorize! :update, security_venue_shift_from_params

        frontend_updates = FrontendUpdates.new
        result = EditSecurityVenueShift.new(
          security_venue_shift: security_venue_shift_from_params,
          security_venue_shift_params: {
            starts_at: security_venue_shift_params.fetch(:startsAt),
            ends_at: security_venue_shift_params.fetch(:endsAt),
          },
          frontend_updates: frontend_updates
        ).call

        if result.success?
          frontend_updates.dispatch
          render(
            json: result.security_venue_shift,
            serializer: Api::V1::SecurityRota::SecurityVenueShiftSerializer,
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def destroy
        authorize! :destroy, security_venue_shift_from_params

        result = DisableSecurityVenueShift.new(
          requester: current_user,
          security_venue_shift: security_venue_shift_from_params,
        ).call

        if result.success?
          render(
            json: result.security_venue_shift,
            serializer: Api::V1::SecurityRota::SecurityVenueShiftSerializer,
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      private
      def edit_rota_shift_params
        params.permit(
          :startsAt,
          :endsAt,
          :shiftType
        )
      end

      def rota_shift_params
        params.permit(
          :startsAt,
          :endsAt,
          :shiftType
        ).merge(
          staff_member: staff_member_from_params
        )
      end

      def security_venue_shift_params
        params.permit(
          :startsAt,
          :endsAt,
          :shiftType
        ).merge(
          staff_member: staff_member_from_params
        )
      end

      def rota_shift_params
        params.permit(
          :startsAt,
          :endsAt,
          :shiftType
        ).merge(
          staff_member: staff_member_from_params
        )
      end

      def rota_date_from_params
        UIRotaDate.parse(params[:rotaDate])
      end

      def venue_from_params
        Venue.find_by(id: params[:venueId])
      end

      def security_venue_from_params
        SecurityVenue.find_by(id: params[:venueId])
      end

      def security_venue_shift_from_params
        SecurityVenueShift.find_by(id: params.fetch(:id))
      end

      def staff_member_from_params
        StaffMember.
          includes([:staff_type]).
          find_by(id: params[:staffMemberId])
      end
    end
  end
end
