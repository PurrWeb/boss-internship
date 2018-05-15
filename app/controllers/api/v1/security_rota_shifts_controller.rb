module Api
  module V1
    class SecurityRotaShiftsController < APIController
      before_filter :web_token_authenticate!

      def create
        frontend_updates = FrontendUpdates.new
        result = CreateRotaShift.new(
          creator: current_user,
          rota_date: rota_date_from_params,
          venue: venue_from_params,
          rota_shift_params: {
            starts_at: rota_shift_params.fetch(:startsAt),
            ends_at: rota_shift_params.fetch(:endsAt),
            shift_type: rota_shift_params.fetch(:shiftType),
            staff_member: rota_shift_params.fetch(:staff_member),
          },
          frontend_updates: frontend_updates,
          authorization_proc: lambda do |rota_shift|
            authorize! :create, rota_shift
          end
        ).call

        if result.success?
          frontend_updates.dispatch
          render(
            json: result.rota_shift,
            serializer: Api::V1::SecurityRota::RotaShiftSerializer,
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def update
        shift = RotaShift.find(params[:id])
        authorize! :update, shift

        frontend_updates = FrontendUpdates.new
        result = EditRotaShift.new(
          rota_shift: shift,
          rota_shift_params: {
            starts_at: rota_shift_params.fetch(:startsAt),
            ends_at: rota_shift_params.fetch(:endsAt),
            shift_type: rota_shift_params.fetch(:shiftType),
          },
          frontend_updates: frontend_updates
        ).call

        if result.success?
          frontend_updates.dispatch
          render json: {
            rotaShift: Api::V1::SecurityRota::RotaShiftSerializer.new(result.rota_shift)
          }
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def destroy
        shift = RotaShift.find(params[:id])
        authorize! :destroy, shift

        frontend_updates = FrontendUpdates.new
        DisableRotaShift.new(
          requester: current_user,
          shift: shift,
          frontend_updates: frontend_updates
        ).call
        frontend_updates.dispatch

        render json: {}
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

      def rota_date_from_params
        UIRotaDate.parse(params[:rotaDate])
      end

      def venue_from_params
        Venue.find_by(id: params[:venueId])
      end

      def staff_member_from_params
        StaffMember.
          includes([:staff_type]).
          find_by(id: params[:staffMemberId])
      end
    end
  end
end
