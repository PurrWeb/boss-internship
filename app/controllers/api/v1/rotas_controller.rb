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
        UIRotaDate.parse(params.fetch(:id))
      end

      def venue_from_params
        Venue.find(params[:venue_id])
      end

      def start_date_from_params
        if params[:start_date].present?
          UIRotaDate.parse(params[:start_date])
        end
      end

      def venue_from_params
        Venue.find_by(id: params[:venue_id])
      end

      def end_date_from_params
        if params[:end_date].present?
          UIRotaDate.parse(parse[:end_date])
        end
      end
    end
  end
end
