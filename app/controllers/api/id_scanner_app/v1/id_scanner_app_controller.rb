module Api
  module IdScannerApp
    module V1
      class IdScannerAppController < ActionController::Base
        before_filter :parse_api_keys
        before_filter :api_key_athenticate!

        def parse_api_keys
          id_scanner_app_api_key = nil
          authenticate_or_request_with_http_token do |supplied_token, other_options|
            id_scanner_app_api_key = IdScannerAppApiKey.find_by(key: supplied_token)
            !!id_scanner_app_api_key
          end
          if id_scanner_app_api_key
            @id_scanner_app_api_key = id_scanner_app_api_key
          end
        end

        def current_api_key
          @id_scanner_app_api_key.andand.api_key.andand.venue
        end

        def api_key_athenticate!
          render(
            json: { errors: "Not authenticated" },
            status: :unauthorized
          ) unless @id_scanner_app_api_key.present?
        end
      end
    end
  end
end
