module Api
  module Wtl
    module V1
      class WtlClientsController < ActionController::Base
        def create
          wtl_client_result = CreateWtlClientApiService.new(params: wtl_client_from_params).call
          if wtl_client_result.success?
            render json: {
                     wtlClient: Api::Wtl::V1::WtlClients::WtlClientSerializer.new(wtl_client_result.wtl_client),
                   }, status: 200
          else
            render json: {errors: wtl_client_result.api_errors.errors}, status: 422
          end
        end

        private

        def wtl_client_from_params
          {
            first_name: params.fetch(:firstName),
            surname: params.fetch(:surname),
            gender: params.fetch(:gender),
            date_of_birth: params.fetch(:dateOfBirth),
            email: params.fetch(:email),
            university: params.fetch(:university),
            card_number: params.fetch(:cardNumber),
          }
        end
      end
    end
  end
end
