module Api
  module V1
    class HolidayReportsController < APIController
      def index
        date = Date.strptime(params[:date], Rota.url_date_format)
        venue = Venue.find(params[:venue])

        authorize!(:manage, :admin)

        holidays_reports_data = HolidayReportsDataQuery.new(date: date, venue: venue)
        render locals: {
          holidays: holidays_reports_data.holidays,
          staff_members: holidays_reports_data.staff_members
        }
      end
    end
  end
end
