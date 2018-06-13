class FinanceReportsController < ApplicationController
  before_action :set_new_layout

  def index
    return redirect_to(finance_report_path(show_redirect_params))
  end

  def show
    unless show_params_present?
      return redirect_to(finance_report_path(show_redirect_params))
    end

    authorize!(:view, :finance_reports)

    respond_to do |format|
      format.html do
        render_finance_reports_html
      end
      format.pdf do
        render_finance_reports_pdf
      end
      format.any(:csv) do
        render_finance_reports_csv
      end
    end
  end

  def render_finance_reports_html
    date = date_from_params
    week = week_from_params
    venue = venue_from_params

    staff_members = FinanceReportStaffMembersQuery.new(
      venue: venue,
      start_date: week.start_date,
      end_date: week.end_date,
      filter_by_weekly_pay_rate: false
    ).to_a

    staff_types = StaffType.all
    staff_members_with_reports = StaffMember.where(id: staff_members.map(&:id))
                                  .weekly_finance_reports(week.start_date)

    reports = FinanceReport.joins(:staff_member)
                .where(staff_member: staff_members)
                .where(week_start: week.start_date)
                .includes(staff_member: [:name, :staff_type])
                .all

    staffs_without_requests = StaffMember.where(id: (staff_members - staff_members_with_reports).map(&:id)).
      includes([:name, :staff_type, :pay_rate, :master_venue])

    generated_reports = staffs_without_requests.map do |staff_member|
      GenerateFinanceReportData.new(
        staff_member: staff_member,
        week: week
      ).call.report
    end

    finance_reports = reports + generated_reports
    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!

    render locals: {
      staff_members: staff_members,
      staff_types: staff_types,
      date: date,
      start_date: week.start_date,
      end_date: week.end_date,
      venue: venue,
      finance_reports: finance_reports,
      access_token: access_token.token
    }
  end

  def render_finance_reports_pdf
    authorize!(:view, :finance_reports)

    date = date_from_params
    week = week_from_params
    venue = venue_from_params
    filter_by_weekly_pay_rate = params.fetch(:pay_rate_filter) == 'weekly'

    staff_members = FinanceReportStaffMembersQuery.new(
      venue: venue,
      start_date: week.start_date,
      end_date: week.end_date,
      filter_by_weekly_pay_rate: filter_by_weekly_pay_rate
    ).to_a

    pdf = FinanceReportPDF.new(
      report_title: 'Finance Report',
      venue: venue,
      week: week,
      filter_by_weekly_pay_rate: filter_by_weekly_pay_rate
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
    filename  = "#{venue.name.parameterize}_#{timestamp_start}_#{timestamp_end}.pdf"
    headers['Content-Disposition'] = "attachment; filename=#{filename}"
    render text: pdf.render, content_type: 'application/pdf'
  end

  def render_finance_reports_csv
    authorize!(:view, :finance_reports)

    week = week_from_params
    venue = venue_from_params
    filter_by_weekly_pay_rate = params.fetch(:pay_rate_filter) == 'weekly'

    staff_members = FinanceReportStaffMembersQuery.new(
      venue: venue,
      start_date: week.start_date,
      end_date: week.end_date,
      filter_by_weekly_pay_rate: filter_by_weekly_pay_rate,
      with_sage_id_only: true
    ).to_a

    csv = SageFinanceReportExportCSV.new({
      staff_members: staff_members,
      week: week
    })

    #TODO: Extract File Timestamp Format to somewhere
    timestamp_start = week.start_date.strftime('%d-%b-%Y')
    timestamp_end = week.end_date.strftime('%d-%b-%Y')
    filename  = "#{venue.name.parameterize}_finance_report_#{timestamp_start}_#{timestamp_end}.csv"
    headers['Content-Disposition'] = "attachment; filename=#{filename}"
    render text: csv.to_s, content_type: 'text/csv'
  end

  private
  def accessible_venues
    AccessibleVenuesQuery.new(current_user).all
  end

  def venue_from_params
    accessible_venues.find_by(id: params[:venue_id])
  end

  def show_params_present?
    venue_from_params.present? &&
      week_from_params.present? &&
        date_from_params.present?
  end

  def show_redirect_params
    venue = venue_from_params || current_user.default_venue
    date = week_from_params || default_week
    {
      id: UIRotaDate.format(date.start_date),
      venue_id: venue.id
    }
  end

  def week_from_params
    RotaWeek.new(UIRotaDate.parse(params.fetch(:id))) if params[:id].present?
  end

  def date_from_params
    UIRotaDate.parse(params[:id]) if params[:id].present?
  end

  def default_week
    RotaWeek.new(RotaShiftDate.to_rota_date(Time.current))
  end

  def index_redirect_params
    week_start = (week_from_params || RotaWeek.new(RotaShiftDate.to_rota_date(Time.current))).start_date
    {
      venue_id: venue_from_params.andand.id || current_venue.andand.id,
      week_start: UIRotaDate.format(week_start),
    }
  end

  def venue_from_params
    Venue.find_by(id: params[:venue_id])
  end

  def staff_member_from_params
    StaffMember.find(params[:staff_member_id])
  end

  def staff_members_from_params
    params.fetch("staff_member_ids").map do |id_param|
      id = Integer(id_param)
      StaffMember.find(id)
    end
  end

end
