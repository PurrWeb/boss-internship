class DailyReportsController < ApplicationController
  def index
    authorize!(:view, :daily_reports)

    if date_from_params.present? && venue_from_params.present?
      date = date_from_params
      venue = venue_from_params
      week = RotaWeek.new(date)

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

      render locals: {
        accessible_venues: accessible_venues,
        venue: venue,
        date: date,
        week: week,
        daily_report: daily_report
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
