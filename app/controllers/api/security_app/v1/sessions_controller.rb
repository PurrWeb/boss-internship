module Api
  module SecurityApp
    module V1
      class SessionsController < SecurityAppController
        before_action :app_api_token_athenticate!, except: [:sign_in, :set_password]
        skip_before_filter :parse_access_tokens, only: [:sign_in, :set_password]

        def sign_in
          staff_member = authenticate_staff_member

          unless authenticate_staff_member.present?
            return render json: {
              errors: {
                base: ['Staff member not found, or password is wrong']
              }
            }, status: 422
          end

          unless staff_member.verified?
            return render json: {
              errors: {
                base: ['Staff member not verified, please check your email to verify']
              }
            }, status: 422
          end

          access_token = staff_member.current_access_token || AppApiAccessToken.new(staff_member: staff_member).persist!
          response.headers['TOKEN'] = access_token.token

          render json: {
            staff_member: staff_member
          }, status: 200
        end

        def set_password
          password = params.fetch(:password)
          password_confirmation = params.fetch(:passwordConfirmation)
          verification_token = params.fetch(:verificationToken)

          staff_member = StaffMember.find_by(verification_token: verification_token)

          unless staff_member.present?
            return render json: {}, status: 404
          end

          result = StaffMemberVerificationService.new(staff_member: staff_member).set_password_and_verify(
            password: password,
            password_confirmation: password_confirmation
          )

          if result.success?
            render json: {}, status: 200
          else
            render 'api/v1/shared/api_errors.json', status: 422 ,locals: { api_errors: result.api_errors }
          end

        end

        private
        def authenticate_staff_member
          StaffMember.joins(:email_address)
            .where(email_addresses: {email: params[:email]})
            .first
            .try(:authenticate, params[:password]) 
        end
      end
    end
  end
end
