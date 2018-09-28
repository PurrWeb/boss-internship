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

      def index
        per_page = 10

        wtl_clients = WtlClientsIndexQuery.new(filter: filter_from_params).all
        paginated_wtl_clients = wtl_clients.paginate(
          page: page_from_params,
          per_page: per_page,
        )

        render json: {
          clients: ActiveModel::Serializer::CollectionSerializer.new(
            paginated_wtl_clients,
            serializer: Api::V1::WtlClients::WtlClientSerializer,
          ),
          pageNumber: page_from_params,
          perPage: per_page,
          totalCount: wtl_clients.count,
          totalPages: (wtl_clients.count / per_page) + 1,
        }
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

      def history
        history = WtlClientHistoryService.new(wtl_client: wtl_client_from_params).call
        render json: {history: history}, status: 200
      end

      private

      def wtl_client_from_params
        WtlClient.find_by(id: params.fetch(:id))
      end

      def filter_from_params
        {
          name: params[:name],
          email: params[:email],
          status: params[:status],
          card_number: params[:cardNumber],
        }
      end

      def page_from_params
        params[:page].to_i == 0 ? 1 : params[:page].to_i
      end
    end
  end
end
