module Api
  module ClockingApp
    module V1
      class SessionsController < ClockingAppController
        skip_before_filter :parse_access_tokens

        def index
          if !venue_api_key_from_params.present?
            render json: {
              errors: {
                base: ['API key invalid or inactive']
              }
            }, status: :unprocessable_entity
          elsif !staff_member_from_params.present?
            render json: {
              errors: {
                base: ['staff member invalid or inactive']
              }
            }, status: :unprocessable_entity
          elsif !staff_member_from_params.pin_code_valid?(pin_code_from_params)
            render json: {
              errors: {
                pincode: ['Wrong pincode'],
              }
            }, status: :unprocessable_entity
          else
            access_token = ClockingAppApiAccessToken.new(staff_member: staff_member_from_params, api_key: venue_api_key_from_params).persist!

            render json: {
              accessToken: access_token.token,
              staffMember: {
                id: staff_member_from_params.id,
                name: staff_member_from_params.name.full_name,
              }
            }
          end
        end

        def ably_auth
          venue_api_key = venue_api_key_from_params.key
          token_request = ClockingAppAblyService.new(venue_api_key: venue_api_key).request_token
          render json: token_request, status: 200
        end

        private
        def venue_api_key_from_params
          ApiKey.boss.active.find_by(key: params.fetch(:apiKey))
        end

        def staff_member_from_params
          StaffMember.enabled.find_by(id: params.fetch(:staffMemberId))
        end

        def pin_code_from_params
          params.fetch(:pincode)
        end
      end
    end
  end
end
