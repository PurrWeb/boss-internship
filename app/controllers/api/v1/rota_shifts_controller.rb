module Api
  module V1
    class RotaShiftsController < APIController
      before_filter :web_token_authenticate!

      def show
        rota_shift = RotaShift.find(params.fetch(:id))
        authorize! :view, rota_shift

        render locals: { rota_shift: rota_shift }
      end

      def create
        frontend_updates = FrontendUpdates.new
        result = CreateRotaShift.new(
          creator: current_user,
          rota_date: rota_date_from_params,
          venue: venue_from_params,
          rota_shift_params: rota_shift_params,
          frontend_updates: frontend_updates,
          authorization_proc: lambda do |rota_shift|
            authorize! :create, rota_shift
          end
        ).call

        if result.success?
          frontend_updates.dispatch
          render json: {
            rotaShift: Api::V1::RotaShifts::RotaShiftSerializer.new(result.rota_shift),
            rota: Api::V1::RotaShifts::RotaSerializer.new(result.rota_shift.rota)
          }
        else
          render(
            'error',
            locals: { rota_shift: result.rota_shift },
            :status => :unprocessable_entity
          )
        end
      end

      def update
        shift = RotaShift.find(params[:id])
        authorize! :update, shift

        frontend_updates = FrontendUpdates.new
        result = EditRotaShift.new(
          rota_shift: shift,
          rota_shift_params: rota_shift_params,
          frontend_updates: frontend_updates
        ).call

        if result.success?
          frontend_updates.dispatch
          render json: {
            rotaShift: Api::V1::RotaShifts::RotaShiftSerializer.new(result.rota_shift),
            rota: Api::V1::RotaShifts::RotaSerializer.new(result.rota_shift.rota)
          }
        else
          render(
            'error',
            locals: { rota_shift: result.rota_shift },
            :status => :unprocessable_entity
          )
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
          :starts_at,
          :ends_at,
          :shift_type
        )
      end

      def rota_shift_params
        params.permit(
          :starts_at,
          :ends_at,
          :shift_type
        ).merge(
          staff_member: staff_member_from_params
        )
      end

      def rota_date_from_params
        UIRotaDate.parse(params[:rota_id])
      end

      def venue_from_params
        Venue.find_by(id: params[:venue_id])
      end

      def staff_member_from_params
        StaffMember.
          includes([:staff_type]).
          find_by(id: params[:staff_member_id])
      end
    end
  end
end
