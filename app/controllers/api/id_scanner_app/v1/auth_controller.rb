module Api
  module IdScannerApp
    module V1
      class AuthController < ActionController::Base
        def auth
          key_from_params = params.fetch('apiKey').strip

          api_key = IdScannerAppApiKey.find_by(
            key: key_from_params
          )
          if !api_key.present?
            render json: {}, status: 401
          elsif !api_key.enabled?
            render json: {}, status: 401
          else
            render json: {}, status: 200
          end
        end
      end
    end
  end
end
