class DailyReportsController < ApplicationController
  before_action :set_new_layout, only: [:index]

  def index
    authorize!(:view, :daily_reports)

    if date_from_params.present? && venue_from_params.present?
      date = date_from_params
      venue = venue_from_params

      daily_report = DailyReport.
        includes([
          staff_member_sections: [
            :staff_type,
            staff_member_listings: [
              staff_member: [:name]
            ]
          ]
        ]).
        find_by(
          date: date,
          venue: venue
        )

      respond_to do |format|
        format.html do
          render(
            locals: {
              accessible_venues: accessible_venues,
              venue: venue,
              date: date,
              week: RotaWeek.new(date),
              daily_report: daily_report
            }
          )
        end

        format.pdf do
          render_daily_report_pdf(
            date: date,
            venue: venue,
            daily_report: daily_report
          )
        end
      end
    else
      redirect_to(redirect_params)
    end
  end

  private
  def render_daily_report_pdf(date:, venue:, daily_report:)
    pdf = DailyReportPDF.new(daily_report: daily_report)

    #TODO: Extract File Timestamp Format to somewhere
    timestamp = date.strftime('%d-%b-%Y')
    filename  = "#{venue.name.parameterize}_daily_report_#{timestamp}.pdf"
    headers['Content-Disposition'] = "attachment; filename=#{filename}"
    render text: pdf.render, content_type: 'application/pdf'
  end

  def accessible_venues
    @accessible_venues ||= AccessibleVenuesQuery.new(current_user).all
  end

  def date_from_params
    if params[:date].present?
      UIRotaDate.parse(params[:date])
    end
  end

  def venue_from_params
    if params[:venue_id].present?
      accessible_venues.find_by(id: params[:venue_id])
    end
  end

  def redirect_params
    {
      date: UIRotaDate.format(date_from_params || RotaShiftDate.to_rota_date(Time.current) - 1.day),
      venue_id: (venue_from_params || current_venue).id
    }
  end
end
