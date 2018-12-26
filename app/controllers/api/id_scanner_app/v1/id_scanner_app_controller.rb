module Api
  module IdScannerApp
    module V1
      class IdScannerAppController < ActionController::Base
        before_filter :parse_api_keys
        before_filter :api_key_athenticate!

        def parse_api_keys
          id_scanner_app_api_key = nil
          authenticate_with_http_token do |supplied_token, other_options|
            id_scanner_app_api_key = IdScannerAppApiKey.find_by(key: supplied_token)
          end
          if id_scanner_app_api_key && id_scanner_app_api_key.enabled?
            @id_scanner_app_api_key = id_scanner_app_api_key
          end
        end

        def current_api_key
          @id_scanner_app_api_key
        end

        def api_key_athenticate!
          render(
            json: { errors: IdScannerAppController.not_authenticated_error_json },
            status: :unauthorized,
          ) unless current_api_key
        end

        private
        def self.not_authenticated_error_json
          { "base" => "Not authenticated" }
        end
      end
    end
  end
end
