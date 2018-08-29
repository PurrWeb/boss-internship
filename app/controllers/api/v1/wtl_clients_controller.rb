module Api
  module V1
    class WtlClientsController < APIController
      def update
      end

      def disable
        wtl_client_result = DisableWtlClientApiService.new(wtl_client: wtl_client_from_params).call
        if wtl_client_result.success?
          render json: {
            wtlClient: Api::V1::WtlClients::WtlClientSerializer.new(wtl_client_result.wtl_client),
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
            wtlClient: Api::V1::WtlClients::WtlClientSerializer.new(wtl_client_result.wtl_client),
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
