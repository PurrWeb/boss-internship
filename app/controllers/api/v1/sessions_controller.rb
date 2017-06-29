module Api
  module V1
    class SessionsController < ApplicationController
      skip_before_filter :authenticate_user!

      def create
        api_key = ApiKey.boss.active.find_by(key: params[:api_key])
        staff_member = StaffMember.enabled.find_by(id: params[:staff_member_id])
        pin_code = params[:staff_member_pin]

        if !api_key.present?
          render json: {
            errors: {
              base: ['API key invalid or inactive']
            }
          }, status: :unprocessable_entity
        elsif !staff_member.present?
          render json: {
            errors: {
              base: ['staff member invalid or inactive']
            }
          }, status: :unprocessable_entity
        elsif pin_code && staff_member.pin_code_valid?(pin_code)
          access_token = AccessToken.create!(
            token_type: 'api',
            expires_at: 30.minutes.from_now,
            creator: api_key,
            api_key: api_key,
            staff_member: staff_member,
          )

          render 'create', locals: {
            access_token: access_token,
            staff_member: {
              id: staff_member.id,
              username: staff_member.name.full_name
            }
          }
        else
          render json: {
              errors: {
                base: ['wrong pin']
              }
            }, status: :unprocessable_entity
        end
      end
    end
  end
end
