module Api
  module SecurityApp
    module V1
      class TestsController < SecurityAppController
        before_action :app_api_token_athenticate!

        def get
          render json: {}, status: 200
        end

        def post
          message = params[:message]
          render json: { message: message }, status: 200
        end
      end
    end
  end
end
