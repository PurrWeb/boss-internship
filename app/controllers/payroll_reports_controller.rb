class PayrollReportsController < ApplicationController
  before_action :set_new_layout

  def index
    return redirect_to(payroll_report_path(id: UIRotaDate.format(default_date)))
  end

  def show
    finance_report_page_filter = FinanceReportPageFilter.new(requester: current_user, params: params)

    unless finance_report_page_filter.required_params_present?
      return redirect_to(payroll_report_path(finance_report_page_filter.redirect_params))
    end

    respond_to do |format|
      format.html do
        render_payroll_reports_html(finance_report_page_filter: finance_report_page_filter)
      end
      format.pdf do
        render_payroll_reports_pdf(finance_report_page_filter: finance_report_page_filter)
      end
    end
  end

  def render_payroll_reports_html(finance_report_page_filter:)
    authorize!(:view, :payroll_reports)

    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!
    ability = UserAbility.new(current_user)

    query_data = FinanceReportPageDataQuery.new(
      finance_report_page_filter: finance_report_page_filter,
      use_frontend_filtering: true,
    ).call

    staff_members = query_data.fetch(:staff_members).
      includes([:name, :staff_type, :pay_rate, :master_venue])
    staff_types = query_data.fetch(:staff_types)
    finance_reports = query_data.fetch(:finance_reports).
      includes([:venue, :staff_member])

    render locals: {
      staff_members: ActiveModelSerializers::SerializableResource.new(
        staff_members,
        each_serializer: Api::V1::FinanceReports::StaffMemberSerializer
      ),
      staff_types: staff_types,
      date: finance_report_page_filter.date,
      start_date: finance_report_page_filter.week.start_date,
      end_date: finance_report_page_filter.week.end_date,
      venue: finance_report_page_filter.venue,
      finance_reports: ActiveModel::Serializer::CollectionSerializer.new(
        finance_reports,
        serializer: Api::V1::FinanceReports::FinanceReportSerializer,
        scope: { ability: ability }
      ),
      access_token: access_token.token
    }
  end

  def render_payroll_reports_pdf(finance_report_page_filter:)
    authorize!(:view, :finance_reports)

    query_data = FinanceReportPageDataQuery.new(
      finance_report_page_filter: finance_report_page_filter,
      use_frontend_filtering: false,
    ).call

    finance_reports = query_data.
      fetch(:finance_reports).
      includes([:venue, :staff_member])

    pdf = FinanceReportPDF.new(
      report_title: 'Payroll Report',
      finance_report_page_filter: finance_report_page_filter,
      display_pay_rate_type: false,
      display_totals: false
    )

    finance_reports.each do |finance_report|
      staff_member = finance_report.staff_member

      pdf.add_report(
        staff_type: staff_member.staff_type,
        report: finance_report
      )
    end

    #TODO: Extract File Timestamp Format to somewhere
    timestamp_start = finance_report_page_filter.week.start_date.strftime('%d-%b-%Y')
    timestamp_end = finance_report_page_filter.week.end_date.strftime('%d-%b-%Y')
    filename  = "#{finance_report_page_filter.venue.name.parameterize}_payroll_report_#{timestamp_start}_#{timestamp_end}.pdf"
    headers['Content-Disposition'] = "attachment; filename=#{filename}"
    render text: pdf.render, content_type: 'application/pdf'
  end

  private
  def default_date
    RotaWeek.new(RotaShiftDate.to_rota_date(Time.current)).start_date
  end
end
