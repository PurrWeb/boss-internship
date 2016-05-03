module Api
  module V1
    class TestController < APIController
      before_filter :web_token_authenticate!

      def get
        render json: {}
      end

      def post
        message = params[:message]
        render json: { message: message }
      end
    end
  end
end
