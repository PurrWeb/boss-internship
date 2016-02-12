class HolidayReportsController < ApplicationController
  def show
    date = Date.strptime(params[:id], Rota.url_date_format)

    holidays_reports_data = HolidayReportsDataQuery.new(date)

    render locals: {
      date: date,
      holidays: holidays_reports_data.holidays,
      staff_members: holidays_reports_data.staff_members,
      venues: Venue.all,
      staff_types: StaffType.all
    }
  end
end
