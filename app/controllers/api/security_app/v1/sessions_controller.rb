module Api
  module SecurityApp
    module V1
      class SessionsController < SecurityAppController
        before_action :security_app_api_token_athenticate!, except: [:new, :forgot_password, :renew]
        skip_before_filter :parse_access_tokens, only: [:new, :forgot_password, :renew]

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
            renew_token = SecurityAppApiRenewToken.issue_new_token!(staff_member: staff_member)

            access_token = SecurityAppApiAccessToken.issue_new_token!(staff_member: staff_member)

            render json: {
              authToken: access_token.token,
              renewToken: renew_token.token,
              expiresAt: access_token.expires_at.utc.iso8601
            }, status: 200
          end
        end

        def renew
          renewalToken = SecurityAppApiRenewToken.find_by_token(token: params.fetch("renewalToken"))
          if !renewalToken
            return render json: {}, status: 403
          else
            staff_member = renewalToken.staff_member
            access_token = SecurityAppApiAccessToken.issue_new_token!(staff_member: staff_member)

            render json: {
              authToken: access_token.token,
              expiresAt: access_token.expires_at.utc.iso8601
            }, status: 200
          end
        end

        def forgot_password
          email = params.fetch("email")
          staff_member = StaffMember.enabled.joins(:email_address).where(email_addresses: {email: email}).first

          if !staff_member.present?
            Rollbar.warning("Reset attempt for invalid email address #{email}")
          else
            StaffMemberPasswordResetService.new(staff_member: staff_member).send_password_reset_email
          end

          render json: {}, status: 200
        end

        def ably_auth
          token_request = SecurityAppAblyService.new.request_token(staff_member: current_staff_member)
          render json: token_request, status: 200
        end

        private
        def authenticate_staff_member
          staff_member = StaffMember.enabled.joins(:email_address)
            .where(email_addresses: {email: params[:username]})
            .first
          if staff_member && staff_member.password_digest.present?
            staff_member.authenticate(params[:password])
          else
            nil
          end
        end
      end
    end
  end
end
