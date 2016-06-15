class FinanceReportsController < ApplicationController
  def index
    authorize! :manage, :admin

    if venue_from_params.present? && week_from_params.present?
      venue = venue_from_params
      week = week_from_params

      staff_members = venue.master_staff_members

      reports = []
      staff_members.each do |staff_member|
        reports << GenerateFinanceReportData.new(
          staff_member: staff_member,
          week: week
        ).call
      end

      accessible_venues = AccessibleVenuesQuery.new(current_user).all

      render locals: {
        week: week,
        venue: venue,
        accessible_venues: accessible_venues,
        reports: reports
      }
    else
      redirect_to(finance_reports_path(index_redirect_params))
    end
  end

  private
  def index_redirect_params
    week_start = (week_from_params || RotaWeek.new(Time.current)).start_date
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
