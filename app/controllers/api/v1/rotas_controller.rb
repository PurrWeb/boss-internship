module Api
  module V1
    class RotasController < APIController
      def show
        rota = Rota.find(params.fetch(:id))
        authorize! :manage, rota

        render locals: { rota: rota }
      end
    end
  end
end
