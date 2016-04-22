module Api
  module V1
    class SessionsController < ApplicationController
      skip_before_filter :authenticate_user!

      def create
        api_key = ApiKey.find_by(key: params[:api_key])
        staff_member = StaffMember.find_by(id: params[:staff_member_id])

        result = api_key.present? &&
          staff_member.present? &&
          staff_member.pin_code == params[:staff_member_pin]

        if result
          access_token = AccessToken.create!(
            token_type: 'api',
            expires_at: 30.minutes.from_now,
            creator: api_key,
            staff_member: staff_member
          )

          render 'create', locals: { access_token: access_token }
        else
          render nothing: true, status: :unprocessable_entity
        end
      end
    end
  end
end
