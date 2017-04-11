class PayrollReportsController < ApplicationController
  def index
    authorize! :view, :payroll_reports

    if venue_from_params.present? && week_from_params.present?
      venue = venue_from_params
      week = week_from_params

      filter_by_weekly_pay_rate = params[:pay_rate_filter] == 'weekly'


      respond_to do |format|
        format.html do
          render locals: {
            venue: venue,
            week: week,
            accessible_venues: AccessibleVenuesQuery.new(current_user).all,
            finance_reports_table: FinanceReportTable.new(
              week: week,
              venue: venue,
              filter_by_weekly_pay_rate: filter_by_weekly_pay_rate
            ),
            pay_rate_filtering: params[:pay_rate_filter]
          }
        end

        format.pdf do
          render_payroll_report_pdf(
            venue: venue,
            week: week,
            staff_members: staff_members,
            filter_by_weekly_pay_rate: filter_by_weekly_pay_rate
          )
        end
      end
    else
      redirect_to(payroll_reports_path(index_redirect_params))
    end
  end

  private
  def render_payroll_report_pdf(venue:, week:, staff_members:, filter_by_weekly_pay_rate:)
    pdf = FinanceReportPDF.new(
      report_title: 'Payroll Report',
      venue: venue,
      week: week,
      filter_by_weekly_pay_rate: filter_by_weekly_pay_rate,
      display_pay_rate_type: false,
      display_totals: false
    )

    staff_members.each do |staff_member|
      pdf.add_report(
        staff_type: staff_member.staff_type,
        report: (
          FinanceReport.find_by(
            staff_member: staff_member,
            week_start: week.start_date
          ) || GenerateFinanceReportData.new(
            staff_member: staff_member,
            week: week
          ).call.report
        )
      )
    end

    #TODO: Extract File Timestamp Format to somewhere
    timestamp_start = week.start_date.strftime('%d-%b-%Y')
    timestamp_end = week.end_date.strftime('%d-%b-%Y')
    filename  = "#{venue.name.parameterize}_payroll_report_#{timestamp_start}_#{timestamp_end}.pdf"
    headers['Content-Disposition'] = "attachment; filename=#{filename}"
    render text: pdf.render, content_type: 'application/pdf'
  end

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
