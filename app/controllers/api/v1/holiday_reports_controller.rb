module Api
  module V1
    class HolidayReportsController < APIController
      def index
        date = UIRotaDate.parse(params[:date])
        venue = Venue.find(params[:venue])

        authorize!(:manage, :admin)

        week = RotaWeek.new(date)
        holidays_reports_data = HolidayReportsDataQuery.new(week: week, venue: venue)
        render locals: {
          holidays: holidays_reports_data.holidays,
          staff_members: holidays_reports_data.staff_members
        }
      end
    end
  end
end
