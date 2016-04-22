module Api
  module V1
    class HolidaysController < WebAPIController
      def show
        holiday = Holiday.find(params[:id])

        render locals: { holiday: holiday }
      end
    end
  end
end
