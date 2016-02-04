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

      def publish
        start_date = start_date_from_params
        end_date = end_date_from_params
        venue = venue_from_params

        UIRotaDate.assert_date_range_valid(start_date, end_date)

        rotas = (start_date..end_date).map do |date|
          Rota.find_or_initialize_by(
            date: date,
            venue: venue
          ).tap do |rota|
            rota.creator ||= current_user
          end
        end

        PublishRotas.new(rotas: rotas).call

        render json: {}
      end

      def mark_in_progress
        rota = Rota.find(params[:id])
        authorize! :manage, rota

        rota.transition_to!(:in_progress)
        render 'show', locals: { rota: rota }
      end

      def mark_finished
        rota = Rota.find(params[:id])
        authorize! :manage, rota

        rota.transition_to!(:finished)
        render 'show', locals: { rota: rota }
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
          UIRotaDate.parse(params[:end_date])
        end
      end
    end
  end
end
