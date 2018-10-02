module Api
  module V1
    class InvitesController < APIController
      before_filter :web_token_authenticate!, except: [:accept]
      skip_before_filter :parse_access_tokens, only: [:accept]

      def create
        result = CreateInviteApiService.new(params: params, requester: current_user).call
        if result.success?
          render json: {invite: Api::V1::Invites::InviteSerializer.new(result.invite)}, status: 200
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def revoke
        result = RevokeInviteApiService.new(params: params).call
        if result.success?
          render json: {invite: Api::V1::Invites::InviteSerializer.new(result.invite)}, status: 200
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def accept
        result = AcceptInviteApiService.new(params: params).call
        if result.success?
          sign_in(:user, result.user)
          render json: {}
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end
    end
  end
end
