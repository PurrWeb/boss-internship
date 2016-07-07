class WeeklyReportsController < ApplicationController
  def index
    authorize! :view, :weekly_reports

    if venue_from_params.present? && week_from_params.present?
      venue = venue_from_params
      week = week_from_params
      accessible_venues = AccessibleVenuesQuery.new(current_user).all

      reports_by_staff_type = {}
      venue.master_staff_members.each do |staff_member|
        reports_by_staff_type[staff_member.staff_type] ||= []
        reports_by_staff_type[staff_member.staff_type] << (FinanceReport.find_by(
          staff_member: staff_member,
          week_start: week.start_date
        ) || GenerateFinanceReportData.new(
          staff_member: staff_member,
          week: week
        ).call.report)
      end

      render locals: { venue: venue, week: week, accessible_venues: accessible_venues, reports_by_staff_type: reports_by_staff_type }
    else
      redirect_to(weekly_reports_path(index_redirect_params))
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
