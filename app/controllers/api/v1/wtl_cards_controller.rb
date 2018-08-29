module Api
  module V1
    class WtlCardsController < APIController
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
    end
  end
end
