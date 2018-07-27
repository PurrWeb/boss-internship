class PayrollReportsController < ApplicationController
  before_action :set_new_layout

  def index
    return redirect_to(payroll_report_path(show_redirect_params))
  end

  def show
    unless show_params_present?
      return redirect_to(payroll_report_path(show_redirect_params))
    end

    respond_to do |format|
      format.html do
        render_payroll_reports_html
      end
      format.pdf do
        render_payroll_reports_pdf
      end
    end
  end

  def render_payroll_reports_html
    date = date_from_params
    week = week_from_params
    venue = venue_from_params
    filter_by_weekly_pay_rate = params[:pay_rate_filter] == 'weekly'

    pay_rates = PayRate.all
    if filter_by_weekly_pay_rate
      pay_rates = PayRate.weekly
    end

    staff_members = StaffMember.
      where(
        master_venue: venue,
        pay_rate: pay_rates
      )

    staff_members = staff_members.
      includes([:name, :staff_type, :pay_rate, :master_venue])

    finance_reports = FinanceReport.
      where(
        venue: venue,
        week_start: week.start_date,
        staff_member: staff_members
      ).
      includes([:venue, :staff_member])

    staff_types = StaffType.
      joins(:staff_members).
      merge(staff_members)

    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!
    ability = UserAbility.new(current_user)

    render locals: {
      staff_members: ActiveModelSerializers::SerializableResource.new(
        staff_members,
        each_serializer: Api::V1::FinanceReports::StaffMemberSerializer
      ),
      staff_types: staff_types,
      date: date,
      start_date: week.start_date,
      end_date: week.end_date,
      venue: venue,
      finance_reports: ActiveModel::Serializer::CollectionSerializer.new(
        finance_reports,
        serializer: Api::V1::FinanceReports::FinanceReportSerializer,
        scope: { ability: ability }
      ),
      access_token: access_token.token
    }
  end

  def render_payroll_reports_pdf
    authorize!(:view, :finance_reports)

    date = date_from_params
    week = week_from_params
    venue = venue_from_params
    filter_by_weekly_pay_rate = params.fetch(:pay_rate_filter) == 'weekly'

    pay_rates = PayRate.all
    if filter_by_weekly_pay_rate
      pay_rates = PayRate.weekly
    end

    staff_members = StaffMember.
      where(
        master_venue: venue,
        pay_rate: pay_rates
      )

    staff_members = staff_members.
      includes([:name, :staff_type, :pay_rate, :master_venue])

    finance_reports = FinanceReport.
      where(
        venue: venue,
        week_start: week.start_date,
        staff_member: staff_members
      ).
      includes([:venue, :staff_member])

    pdf = FinanceReportPDF.new(
      report_title: 'Finance Report',
      venue: venue,
      week: week,
      filter_by_weekly_pay_rate: filter_by_weekly_pay_rate,
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
    timestamp_start = week.start_date.strftime('%d-%b-%Y')
    timestamp_end = week.end_date.strftime('%d-%b-%Y')
    filename  = "#{venue.name.parameterize}_payroll_report_#{timestamp_start}_#{timestamp_end}.pdf"
    headers['Content-Disposition'] = "attachment; filename=#{filename}"
    render text: pdf.render, content_type: 'application/pdf'
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
