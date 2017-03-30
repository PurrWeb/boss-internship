class YearlyReportsController < ApplicationController
  def index
    authorize! :manage, :admin

    if venue_from_params.present? && tax_year_from_params.present?
      venue = venue_from_params
      tax_year = tax_year_from_params

      accessible_venues = AccessibleVenuesQuery.new(current_user).all

      selectable_years = YearlyReport.years

      yearly_reports_table = YearlyReportsTable.new(
        tax_year: tax_year,
        venue: venue
      )

      render locals: {
        venue: venue,
        tax_year: tax_year_from_params,
        selectable_years: selectable_years,
        accessible_venues: accessible_venues,
        yearly_reports_table: yearly_reports_table
      }
    else
      redirect_to(
        yearly_reports_path(index_redirect_params)
      )
    end
  end

  def index_redirect_params
    {
      venue_id: venue_from_params.andand.id || current_user.default_venue.andand.id,
      year: tax_year_from_params.andand.year || TaxYear.new(Time.current).year
    }
  end

  def venue_from_params
    Venue.find_by(id: params[:venue_id])
  end

  def tax_year_from_params
    year = params[:year].andand.to_i
    if year.present? && YearlyReport.years.include?(year)
      TaxYear.for_year(year)
    end
  end
end
