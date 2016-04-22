module Api
  module V1
    class TestController < WebAPIController
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
