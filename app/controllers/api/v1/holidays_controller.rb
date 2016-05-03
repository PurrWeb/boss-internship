module Api
  module V1
    class HolidaysController < APIController
      before_filter :web_token_authenticate!

      def show
        holiday = Holiday.find(params[:id])

        render locals: { holiday: holiday }
      end
    end
  end
end
