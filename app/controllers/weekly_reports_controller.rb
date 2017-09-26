class WeeklyReportsController < ApplicationController
  def index
    authorize!(:view, :weekly_reports)

    if venue_from_params.present? && week_from_params.present?
      venue = venue_from_params
      week = week_from_params
      accessible_venues = AccessibleVenuesQuery.new(current_user).all

      totals = {
        overheads_cents: 0,
        rotaed_cost_cents: 0,
        actual_cost_cents: 0,
        variance_cents: 0
      }

      reports = {}
      (week.start_date..week.end_date).each do |date|
        report = DailyReport.find_by(
          date: date,
          venue: venue
        )

        if report.present?
          totals[:overheads_cents] += report.overheads_cents
          totals[:rotaed_cost_cents] += report.rotaed_cost_cents
          totals[:actual_cost_cents] += report.actual_cost_cents
          totals[:variance_cents] += report.variance_cents
        end

        reports[date] = report
      end

      render locals: {
        accessible_venues: accessible_venues,
        venue: venue,
        week: week,
        reports: reports,
        totals: totals
      }
    else
      redirect_to(weekly_reports_path(index_redirect_params))
    end
  end

  private
  def index_redirect_params
    week_start = (week_from_params || RotaWeek.new(RotaShiftDate.to_rota_date(Time.current))).start_date
    {
      venue_id: venue_from_params.andand.id || current_user.default_venue.andand.id,
      week_start: UIRotaDate.format(week_start),
    }
  end

  def venue_from_params
    Venue.find_by(id: params[:venue_id])
  end

  def week_from_params
    if params[:week_start].present?
      RotaWeek.new(UIRotaDate.parse(params[:week_start]))
    end
  end
end
