module Api
  module V1
    class HolidayReportsController < APIController
      def show
        date = Date.strptime(params[:id], Rota.url_date_format)

        holidays_reports_data = HolidayReportsDataQuery.new(date)

        render locals: {
          holidays: holidays_reports_data.holidays,
          staff_members: holidays_reports_data.staff_members
        }
      end
    end
  end
end
