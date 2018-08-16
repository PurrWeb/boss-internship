class YearlyReportsController < ApplicationController
  def index
    authorize! :view, :yearly_reports

    if venue_from_params.present? && tax_year_from_params.present?
      venue = venue_from_params
      tax_year = tax_year_from_params

      yearly_reports_table = YearlyReportsTable.new(
        tax_year: tax_year,
        venue: venue
      )

      respond_to do |format|
        format.html do
          accessible_venues = AccessibleVenuesQuery.new(current_user).all
          selectable_years = YearlyReport.years

          render locals: {
            venue: venue,
            tax_year: tax_year_from_params,
            selectable_years: selectable_years,
            accessible_venues: accessible_venues,
            yearly_reports_table: yearly_reports_table
          }
        end

        format.pdf do
          render_yearly_reports_pdf(
            venue: venue,
            tax_year: tax_year_from_params,
            yearly_reports_table: yearly_reports_table
          )
        end
      end
    else
      redirect_to(
        yearly_reports_path(index_redirect_params)
      )
    end
  end

  def hour_report
    authorize!(:view, :yearly_reports)

    staff_member = StaffMember.find(params.fetch(:staff_member_id))
    venue = Venue.find_by!(id: params[:venue_id])
    tax_year = tax_year_from_params

    raise 'unsupported tax year' unless tax_year.present?
    report = GenerateYearlyReportData.new(
      staff_member: staff_member,
      tax_year: tax_year
    ).call

    render locals: {
      staff_member: staff_member,
      venue: venue,
      tax_year: tax_year,
      report: report
    }
  end

  def index_redirect_params
    {
      venue_id: venue_from_params.andand.id || current_venue.andand.id,
      year: tax_year_from_params.andand.year || TaxYear.new(Time.current).year
    }
  end

  def render_yearly_reports_pdf(venue:, tax_year:, yearly_reports_table:)
    time_stamp = Time.current.strftime('%d-%m-%Y-%H-%M')

    pdf = YearlyReportPDF.new(
      venue: venue,
      tax_year: tax_year,
      yearly_reports_table: yearly_reports_table,
      time_stamp: time_stamp
    )

    #TODO: Extract File Timestamp Format to somewhere
    filename  = "#{venue.name.parameterize}_#{tax_year.year}_yearly_report_#{time_stamp}.pdf"
    headers['Content-Disposition'] = "attachment; filename=#{filename}"
    render text: pdf.render, content_type: 'application/pdf'
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
