class DailyReportsController < ApplicationController
  def index
    authorize!(:view, :daily_reports)

    if date_from_params.present? && venue_from_params.present?
      date = date_from_params
      venue = venue_from_params

      daily_report_summary = DailyReportSummaryCalculator.new(
        date: date,
        venue: venue
      )

      render locals: {
        accessible_venues: accessible_venues,
        venue: venue,
        date: date,
        report_summary_data: daily_report_summary.calculate,
        staff_members: daily_report_summary.staff_members
      }
    else
      redirect_to(redirect_params)
    end
  end

  private
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
      venue_id: (venue_from_params || accessible_venues.first).id
    }
  end
end
