module Api
  module SecurityApp
    module V1
      class SessionsController < SecurityAppController
        before_action :security_app_api_token_athenticate!, except: [:new]
        skip_before_filter :parse_access_tokens, only: [:new]

        def new
          staff_member = authenticate_staff_member

          if !staff_member.present?
            return render json: {
              errors: {
                base: ['Staff member not found, or password is wrong']
              }
            }, status: 422
          elsif !staff_member.verified?
            return render json: {
              errors: {
                base: ['Staff member not verified, please check your email to verify']
              }
            }, status: 403
          else
            access_token = staff_member.current_security_app_access_token || SecurityAppApiAccessToken.new(staff_member: staff_member).persist!
            response.headers['TOKEN'] = access_token.token

            render json: {
              token: access_token.token
            }, status: 200
          end
        end

        private
        def authenticate_staff_member
          StaffMember.enabled.joins(:email_address)
            .where(email_addresses: {email: params[:username]})
            .first
            .andand
            .authenticate(params[:password])
        end
      end
    end
  end
end
