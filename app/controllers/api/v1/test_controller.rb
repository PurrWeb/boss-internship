module Api
  module V1
    class TestController < APIController
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
