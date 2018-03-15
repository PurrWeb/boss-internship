module Api
  module SecurityApp
    module V1
      class SecurityAppController < ActionController::Base
        before_filter :parse_access_tokens

        rescue_from CanCan::AccessDenied do |exception|
          message = {}
          message = {base: ['Only security staffs can access to this page']} if exception.action == :access
          render json: {errors: message}, status: 403
        end

        def parse_access_tokens
          security_app_api_token = nil
          authenticate_or_request_with_http_token do |supplied_token, other_options|
            security_app_api_token = SecurityAppApiAccessToken.find_by_token(token: supplied_token)
            !!security_app_api_token
          end
          if security_app_api_token && (security_app_api_token.expires_at > Time.current)
            @security_app_api_access_token = security_app_api_token
          end
        end

        def current_mobile_app
          @current_mobile_app ||= MobileApp.security_app
        end

        def current_staff_member
          if @security_app_api_access_token.present?
            @security_app_api_access_token.staff_member
          end
        end

        def current_ability
          @current_ability ||= StaffMemberAbility.new(current_staff_member)
        end

        def security_app_api_token_athenticate!
          render(
            json: { errors: "Not authenticated" },
            status: :unauthorized
          ) unless @security_app_api_access_token.present?
        end

        def staff_member_verify!
          render(
            json: { errors: {verification: ["Not verified, please check your email to verify"]} },
            status: 422
          ) unless @security_app_api_access_token.present? && @security_app_api_access_token.staff_member.verified?
        end
      end
    end
  end
end
