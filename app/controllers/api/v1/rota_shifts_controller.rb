module Api
  module V1
    class RotaShiftsController < APIController
      def show
        rota_shift = RotaShift.find(params.fetch(:id))
        render locals: { rota_shift: rota_shift }
      end

      def create
        rota_shift = RotaShift.new(rota_shift_params)

        if rota_shift.save
          render 'show', locals: { rota_shift: rota_shift }
        else
          render(
            'error',
            locals: { rota_shift: rota_shift },
            :status => :unprocessable_entity
          )
        end
      end

      def destroy
        shift = RotaShift.find(params[:id])
        DisableRotaShift.new(requester: current_user, shift: shift).call
        render json: {}
      end

      private
      def rota_shift_params
        params.permit(
          :starts_at,
          :ends_at
        ).merge(
          rota: rota_from_params,
          staff_member: staff_member_from_params,
          creator: current_user
        )
      end

      def rota_from_params
        Rota.find_by(id: params[:rota_id])
      end

      def staff_member_from_params
        StaffMember.find_by(id: params[:staff_member_id])
      end
    end
  end
end
