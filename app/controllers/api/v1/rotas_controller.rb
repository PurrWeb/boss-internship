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
        date = date_from_query_params
        venue = venue_from_params

        authorize! :manage, venue

        week = RotaWeek.new(date)

        rotas = (week.start_date..week.end_date).map do |rota_date|
          Rota.find_or_initialize_by(
            date: rota_date,
            venue: venue
          ).tap do |rota|
            rota.creator ||= current_user
          end
        end

        PublishRotas.new(rotas: rotas).call

        render json: {}
      end

      def mark_in_progress
        rota = Rota.find_or_initialize_by(
          date: rota_date_from_params,
          venue: venue_from_params
        )
        authorize! :manage, rota

        ActiveRecord::Base.transaction do
          if !rota.persisted?
            rota.update_attributes!(creator: current_user)
          end
          rota.transition_to!(:in_progress)
        end

        render 'show', locals: { rota: rota }
      end

      def mark_finished
        rota = Rota.find_or_initialize_by(
          date: rota_date_from_params,
          venue: venue_from_params
        )
        authorize! :manage, rota

        ActiveRecord::Base.transaction do
          if !rota.persisted?
            rota.update_attributes!(creator: current_user)
          end
          rota.transition_to!(:finished)
        end

        render 'show', locals: { rota: rota }
      end

      private
      def rota_date_from_params
        UIRotaDate.parse(params.fetch(:id))
      end

      def venue_from_params
        Venue.find(params[:venue_id])
      end

      def date_from_query_params
        UIRotaDate.parse(params.fetch(:date))
      end
    end
  end
end
