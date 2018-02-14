module Api
  module V1
    class MachinesRefloatsController < APIController
      before_filter :web_token_authenticate!

      def create
        authorize!(:create, :machines_refloats)

        result = MachinesRefloatsApiService.new(
          requester: current_user,
          machine: machine_from_params
        ).create({
          refill_x_10p: params.fetch("refillX10p"),
          cash_in_x_10p: params.fetch("cashInX10p"),
          cash_out_x_10p: params.fetch("cashOutX10p"),
          float_topup_cents: params.fetch("floatTopupCents"),
          float_topup_note: params.fetch("floatTopupNote"),
          money_banked_cents: params.fetch("moneyBankedCents"),
          money_banked_note: params.fetch("moneyBankedNote")
        })
        if result.success?
          machine = MachinesRefloats::MachinesSerializer.new(result.machine_refloat.machine)
          machines_refloat = MachinesRefloats::MachinesRefloatSerializer.new(result.machine_refloat)
          render(
            json: {
              machine: machine,
              machines_refloat: machines_refloat
            },
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

      def machine_from_params
        venue_from_params.machines.enabled.find(params.fetch("machineId"))
      end
    end
  end
end
