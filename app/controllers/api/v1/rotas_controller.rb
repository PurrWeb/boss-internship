module Api
  module V1
    class RotasController < APIController
      def show
        rota = Rota.find(params.fetch(:id))
        authorize! :manage, rota

        render locals: { rota: rota }
      end

      def overview
        rota = Rota.find_or_initialize_by(
          date: rota_date_from_params,
          venue: venue_from_params
        )
        authorize! :manage, rota

        staff_types = StaffType.all

        render locals: {
          rota: rota,
          staff_types: staff_types
        }
      end

      private
      def rota_date_from_params
        Time.strptime(params.fetch(:id), Rota.url_date_format)
      end

      def venue_from_params
        Venue.find(params[:venue_id])
      end
    end
  end
end
