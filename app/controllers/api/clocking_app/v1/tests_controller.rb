module Api
  module ClockingApp
    module V1
      class TestsController < ClockingAppController
        skip_before_filter :clocking_app_api_token_athenticate!

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
