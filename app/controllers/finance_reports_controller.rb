class FinanceReportsController < ApplicationController
  before_action :set_new_layout

  def index
    return redirect_to(finance_report_path(id: UIRotaDate.format(default_date)))
  end

  def show
    finance_report_page_filter = FinanceReportPageFilter.new(requester: current_user, params: params)

    unless finance_report_page_filter.required_params_present?
      return redirect_to(finance_report_path(finance_report_page_filter.redirect_params))
    end

    authorize!(:view, :finance_reports)

    respond_to do |format|
      format.html do
        render_finance_reports_html(finance_report_page_filter: finance_report_page_filter)
      end
      format.pdf do
        render_finance_reports_pdf(finance_report_page_filter: finance_report_page_filter)
      end
      format.any(:csv) do
        render_finance_reports_csv(finance_report_page_filter: finance_report_page_filter)
      end
    end
  end

  def render_finance_reports_html(finance_report_page_filter:)
    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!

    query_data = FinanceReportPageDataQuery.new(
      finance_report_page_filter: finance_report_page_filter,
      use_frontend_filtering: true,
    ).call

    show_pdf_download_link = finance_report_page_filter.week < RotaWeek.new(RotaShiftDate.to_rota_date(Time.current))

    staff_members = query_data.fetch(:staff_members).
      includes([:name, :staff_type, :pay_rate, :master_venue])
    staff_types = query_data.fetch(:staff_types)
    finance_reports = query_data.fetch(:finance_reports).
      includes([:venue, :staff_member])

    render locals: {
      show_pdf_download_link: show_pdf_download_link,
      staff_members: staff_members,
      staff_types: staff_types,
      date: finance_report_page_filter.date,
      start_date: finance_report_page_filter.week.start_date,
      end_date: finance_report_page_filter.week.end_date,
      venue: finance_report_page_filter.venue,
      finance_reports: finance_reports,
      access_token: access_token.token
    }
  end

  def render_finance_reports_pdf(finance_report_page_filter:)
    authorize!(:view, :finance_reports)

    raise 'illegal attempt to render pdf' unless finance_report_page_filter.week < RotaWeek.new(RotaShiftDate.to_rota_date(Time.current))

    query_data = FinanceReportPageDataQuery.new(
      finance_report_page_filter: finance_report_page_filter,
      use_frontend_filtering: false
    ).call

    finance_reports = query_data.
      fetch(:finance_reports).
      includes([:venue, :staff_member])

    pdf = FinanceReportPDF.new(
      report_title: 'Finance Report',
      finance_report_page_filter: finance_report_page_filter
    )

    finance_reports.each do |finance_report|
      staff_member = finance_report.staff_member

      pdf.add_report(staff_type: staff_member.staff_type, report: finance_report)
    end

    #TODO: Extract File Timestamp Format to somewhere
    timestamp_start = finance_report_page_filter.week.start_date.strftime('%d-%b-%Y')
    timestamp_end = finance_report_page_filter.week.end_date.strftime('%d-%b-%Y')
    filename  = "#{finance_report_page_filter.venue.name.parameterize}_#{timestamp_start}_#{timestamp_end}.pdf"
    headers['Content-Disposition'] = "attachment; filename=#{filename}"
    render text: pdf.render, content_type: 'application/pdf'
  end

  def render_finance_reports_csv(finance_report_page_filter:)
    authorize!(:view, :finance_reports)

    csv = SageFinanceReportExportCSV.new({
      finance_report_page_filter: finance_report_page_filter
    })

    #TODO: Extract File Timestamp Format to somewhere
    week_start_timestamp = finance_report_page_filter.week.start_date.strftime('%d-%b-%Y')
    timestamp = Time.current.strftime('%d-%b-%Y-%H-%M')
    filename  = "#{finance_report_page_filter.venue.name.parameterize}_#{week_start_timestamp}_finance_report_#{timestamp}.csv"
    headers['Content-Disposition'] = "attachment; filename=#{filename}"
    render text: csv.to_s, content_type: 'text/csv'
  end

  def default_date
    RotaWeek.new(RotaShiftDate.to_rota_date(Time.current)).start_date
  end
end
