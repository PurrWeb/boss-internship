module Api
  module V1
    class MachinesController < APIController
      before_filter :web_token_authenticate!

      def create
        authorize!(:create, :machines)

        result = MachineApiService.new(
          requester: current_user,
          venue: venue_from_params
        ).create({
          name: params.fetch("name"),
          location: params.fetch("location"),
          float_cents: params.fetch("floatCents"),
          initial_refill_x_10p: params.fetch("initialRefillX10p"),
          initial_cash_in_x_10p: params.fetch("initialCashInX10p"),
          initial_cash_out_x_10p: params.fetch("initialCashOutX10p"),
          initial_float_topup_cents: params.fetch("initialFloatTopupCents")
        })

        if result.success?
          render(
            json: result.machine,
            serializer: Api::V1::Machines::MachinesSerializer,
            status: 200
          )
        else
          render(
            'api/v1/shared/api_errors.json',
            status: 422,
            locals: { api_errors: result.api_errors }
          )
        end
      end

      def update
        authorize!(:update, :machines)

        result = MachineApiService.new(
          requester: current_user,
          venue: venue_from_params
        ).update({
          id: params.fetch(:id),
          name: params.fetch(:name),
          location: params.fetch(:location),
        })

        if result.success?
          render(
            json: result.machine,
            serializer: Api::V1::Machines::MachinesSerializer,
            status: 200
          )
        else
          render(
            'api/v1/shared/api_errors.json',
            status: 422,
            locals: { api_errors: result.api_errors }
          )
        end
      end

      def destroy
        authorize!(:update, :machines)

        result = MachineApiService.new(
          requester: current_user,
          venue: venue_from_params
        ).destroy({
          id: params.fetch(:id)
        })

        if result.success?
          render(
            json: result.machine,
            serializer: Api::V1::Machines::MachinesSerializer,
            status: 200
          )
        else
          render(
            'api/v1/shared/api_errors.json',
            status: 422,
            locals: { api_errors: result.api_errors }
          )
        end
      end

      def restore
        authorize!(:restore, :machines)

        result = MachineApiService.new(
          requester: current_user,
          venue: venue_from_params
        ).restore({
          id: params.fetch(:id),
          name: params.fetch("name"),
          location: params.fetch("location"),
          initial_refill_x_10p: params.fetch("initialRefillX10p"),
          initial_cash_in_x_10p: params.fetch("initialCashInX10p"),
          initial_cash_out_x_10p: params.fetch("initialCashOutX10p")
        })

        if result.success?
          render(
            json: result.machine,
            serializer: Api::V1::Machines::MachinesSerializer,
            status: 200
          )
        else
          render(
            'api/v1/shared/api_errors.json',
            status: 422,
            locals: { api_errors: result.api_errors }
          )
        end
      end

      private
      def authorize_admin
        authorize! :manage, :admin
      end

      def accessible_venues
        AccessibleVenuesQuery.new(current_user).all
      end

      def venue_from_params
        accessible_venues.find_by(id: params.fetch("venueId"))
      end
    end
  end
end
