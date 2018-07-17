module Api
  module ClockingApp
    module V1
      class ClockingAppController < ActionController::Base
        before_filter :parse_access_tokens

        def parse_access_tokens
          clocking_app_api_token = nil
          authenticate_or_request_with_http_token do |supplied_token, other_options|
            clocking_app_api_token = ClockingAppApiAccessToken.find_by_token(token: supplied_token)
            !!clocking_app_api_token
          end
          if clocking_app_api_token && (clocking_app_api_token.expires_at > Time.current)
            @clocking_app_api_access_token = clocking_app_api_token
          end
        end

        def current_mobile_app
          @current_mobile_app ||= MobileApp.clocking_app
        end

        def current_staff_member
          if @clocking_app_api_access_token.present?
            @clocking_app_api_access_token.staff_member
          end
        end

        def current_ability
          @current_ability ||= StaffMemberAbility.new(current_staff_member)
        end

        def venue_from_api_key
          @clocking_app_api_access_token.andand.api_key.andand.venue
        end

        def clocking_app_api_token_athenticate!
          render(
            json: { errors: "Not authenticated" },
            status: :unauthorized
          ) unless @clocking_app_api_access_token.present?
        end

        def staff_member_verify!
          render(
            json: { errors: {verification: ["Not verified, please check your email to verify"]} },
            status: 422
          ) unless @clocking_app_api_access_token.present?
        end
      end
    end
  end
end
