module Api
  module V1
    class WtlClientsController < APIController
      before_filter :web_token_authenticate!
      skip_before_filter :set_paper_trail_whodunnit

      def user_for_paper_trail
        {
          id: current_user.id,
          full_name: current_user.full_name,
        }.to_json
      end

      def update
        wtl_client_result = UpdateWtlClientApiService
          .new(wtl_client: wtl_client_from_params, requester: current_user)
          .call(params: params)

        if wtl_client_result.success?
          render json: {
                   client: Api::V1::WtlClients::WtlClientSerializer.new(wtl_client_result.wtl_client),
                 }, status: 200
        else
          render json: {
                   errors: wtl_client_result.api_errors.errors,
                 }, status: wtl_client_result.api_errors.response_status
        end
      end

      def disable
        wtl_client_result = DisableWtlClientApiService.new(wtl_client: wtl_client_from_params).call
        if wtl_client_result.success?
          render json: {
            client: Api::V1::WtlClients::WtlClientSerializer.new(wtl_client_result.wtl_client),
          }, status: 200
        else
          render json: {
            errors: wtl_client_result.api_errors.errors,
          }, status: 422
        end
      end

      def enable
        wtl_client_result = EnableWtlClientApiService.new(wtl_client: wtl_client_from_params).call
        if wtl_client_result.success?
          render json: {
            client: Api::V1::WtlClients::WtlClientSerializer.new(wtl_client_result.wtl_client),
          }, status: 200
        else
          render json: {
            errors: wtl_client_result.api_errors.errors,
          }, status: 422
        end
      end

      private

      def wtl_client_from_params
        WtlClient.find_by(id: params.fetch(:id))
      end
    end
  end
end
