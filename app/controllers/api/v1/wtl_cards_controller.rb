module Api
  module V1
    class WtlCardsController < APIController
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

        wtl_cards = WtlCardsIndexQuery.new(filter: filter_from_params).all
        paginated_wtl_cards = wtl_cards.paginate(
          page: page_from_params,
          per_page: per_page,
        )
        wtl_clients = WtlClient.includes([:wtl_card]).where(wtl_card_id: paginated_wtl_cards.map(&:id))

        render json: {
          cards: ActiveModel::Serializer::CollectionSerializer.new(
            paginated_wtl_cards,
            serializer: Api::V1::WtlCards::WtlCardSerializer,
          ),
          clients: ActiveModel::Serializer::CollectionSerializer.new(
            wtl_clients,
            serializer: Api::V1::WtlCards::WtlClientSerializer,
          ),
          pageNumber: page_from_params,
          perPage: per_page,
          totalCount: wtl_cards.count,
          totalPages: (wtl_cards.count / per_page) + 1,
        }
      end

      def create
        wtl_card_result = CreateWtlCardApiService.new(params: wtl_card_from_params).call
        if wtl_card_result.success?
          render json: {
                   card: Api::V1::WtlCards::WtlCardSerializer.new(wtl_card_result.wtl_card),
                 }, status: 200
        else
          render json: {errors: wtl_card_result.api_errors.errors}, status: 422
        end
      end

      def disable
        wtl_card_result = DisableWtlCardApiService.new(wtl_card: wtl_card_from_card_number).call
        if wtl_card_result.success?
          render json: {
                   card: Api::V1::WtlCards::WtlCardSerializer.new(wtl_card_result.wtl_card),
                 }, status: 200
        else
          render json: {errors: wtl_card_result.api_errors.errors}, status: 422
        end
      end

      def enable
        wtl_card_result = EnableWtlCardApiService.new(wtl_card: wtl_card_from_card_number).call
        if wtl_card_result.success?
          render json: {
                   card: Api::V1::WtlCards::WtlCardSerializer.new(wtl_card_result.wtl_card),
                 }, status: 200
        else
          render json: {errors: wtl_card_result.api_errors.errors}, status: 422
        end
      end

      def history
        history = WtlCardHistoryService.new(wtl_card: wtl_card_from_card_number).call
        render json: {history: history}, status: 200
      end

      private

      def wtl_card_from_card_number
        WtlCard.find_by(number: params.fetch(:id))
      end

      def number_from_query
        params["card_number"]
      end

      def wtl_card_from_params
        {
          number: params.fetch(:number),
        }
      end

      def filter_from_params
        {
          card_number: params[:card_number],
          status: params[:status]
        }
      end

      def page_from_params
        params[:page].to_i == 0 ? 1 : params[:page].to_i
      end
    end
  end
end
