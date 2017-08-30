class IncidentReportsController < ApplicationController
  before_filter :set_new_layout, only: [:index, :show]

  def index
    if !index_params_present?
      return redirect_to(incident_reports_path(index_redirect_params))
    end

    authorize! :manage, venue_from_params
    authorize! :manage, :incident_reports

    incident_reports = IncidentReport.enabled
    report_creator_users = User.joins(:incident_reports)

    render locals: {
      incident_reports: incident_reports,
      current_venue: venue_from_params,
      report_creator_users: report_creator_users,
      accessible_venues: accessible_venues,
      start_date: start_date_from_params,
      end_date: end_date_from_params,
      filter_report_creator_id: params[:created_by]
    }
  end

  def show
    incident_report = IncidentReport.find(params[:id])

    authorize! :manage, incident_report

    render locals: {
      incident_report: incident_report
    }
  end

  private
  def index_params_present?
    venue_from_params.present? &&
      start_date_from_params.present? &&
      end_date_from_params.present?
  end

  def start_date_from_params
    result = nil
    begin
      result = UIRotaDate.parse(params[:start_date])
    rescue; end
    result
  end

  def end_date_from_params
    result = nil
    begin
      result = UIRotaDate.parse(params[:end_date])
    rescue; end
    result
  end

  def index_redirect_params
    venue = venue_from_params || current_user.default_venue
    start_date = start_date_from_params || current_tax_year.start_date
    end_date = end_date_from_params || RotaShiftDate.to_rota_date(Time.current)
    {
      venue_id: venue.id,
      start_date: UIRotaDate.format(start_date),
      end_date: UIRotaDate.format(end_date),
      created_by: params[:created_by]
    }
  end

  def accessible_venues
    AccessibleVenuesQuery.new(current_user).all
  end

  def venue_from_params
    accessible_venues.find_by(id: params[:venue_id])
  end

  def current_tax_year
    @current_tax_year ||= TaxYear.new(RotaShiftDate.to_rota_date(Time.current))
  end
end
