module Api
  module SecurityApp
    module V1
      class SecurityAppController < ActionController::Base
        before_filter :parse_access_tokens

        def parse_access_tokens
          app_api_token = nil
          authenticate_or_request_with_http_token do |supplied_token, other_options|
            app_api_token = AppApiAccessToken.find_by_token(token: supplied_token)
            !!app_api_token
          end
          if app_api_token && (app_api_token.expires_at.nil? || app_api_token.expires_at > Time.current)
            @app_api_access_token = app_api_token
          end
        end

        def app_api_token_athenticate!
          render(
            json: { errors: "Not authenticated" },
            status: :unauthorized
          ) unless @app_api_access_token.present?
        end

        def staff_member_verify!
          render(
            json: { errors: {verification: ["Not verified, please check your email to verify"]} },
            status: 422
          ) unless @app_api_access_token.present? && @app_api_access_token.staff_member.verified?
        end
      end
    end
  end
end
    