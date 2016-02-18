class HolidayReportsController < ApplicationController
  def index
    authorize!(:manage, :admin)
    venue = Venue.find_by(id: params[:venue])
    if params[:date]
      date = UIRotaDate.parse(params[:date])
    else
      redirect_to holiday_reports_path(date: UIRotaDate.format(Time.now.to_date), venue: venue)
      return
    end

    week = RotaWeek.new(date)

    holidays_reports_data = HolidayReportsDataQuery.new(week: week, venue: venue)

    respond_to do |format|
      format.html do
        render locals: {
          week: week,
          holidays: holidays_reports_data.holidays,
          staff_members: holidays_reports_data.staff_members,
          venues: Venue.all,
          staff_types: StaffType.all,
          venue: venue
        }
      end

      format.csv do
        csv = HolidayReportCSV.new(holidays_reports_data.holidays)
        #TODO: Extract File Timestamp Format to somewhere
        timestamp = week.start_date.strftime('%d-%b-%Y-%H-%M')
        filename  = "holiday-report-#{timestamp}.csv"
        headers['Content-Disposition'] = "attachment; filename=#{filename}"
        render text: csv.to_s, content_type: 'text/csv'
      end
    end
  end
end
