module Api
  module V1
    class RotaShiftsController < APIController
      def show
        rota_shift = RotaShift.find(params.fetch(:id))
        render locals: { rota_shift: rota_shift }
      end
    end
  end
end
