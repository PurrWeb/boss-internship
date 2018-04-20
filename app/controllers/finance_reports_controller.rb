class FinanceReportsController < ApplicationController
  def index
    return redirect_to(finance_report_path(show_redirect_params))
  end

  def show
    unless show_params_present?
      return redirect_to(finance_report_path(show_redirect_params))
    end

    date = date_from_params
    week = week_from_params
    venue = venue_from_params

    staff_members = FinanceReportStaffMembersQuery.new(
      venue: venue,
      start_date: week.start_date,
      end_date: week.end_date,
      filter_by_weekly_pay_rate: false
    ).all

    staff_types = StaffType.all
    staff_members_with_reports = StaffMember.where(id: staff_members.map(&:id))
                                  .weekly_finance_reports(week.start_date)
                                  .includes([:name, :staff_type])
    reports = FinanceReport.joins(:staff_member)
                .where(staff_member: staff_members)
                .where(week_start: week.start_date).all
    staffs_without_requests = staff_members - staff_members_with_reports
    generated_reports = staffs_without_requests.map do |staff_member|
      GenerateFinanceReportData.new(
        staff_member: staff_member,
        week: week
      ).call.report
    end

    finance_reports = reports + generated_reports

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
      finance_reports: ActiveModelSerializers::SerializableResource.new(
        finance_reports,
        each_serializer: Api::V1::FinanceReports::FinanceReportSerializer
      )
    }

  end

  def dindex
    authorize!(:view, :finance_reports)

    if venue_from_params.present? && week_from_params.present?
      venue = venue_from_params
      week = week_from_params
      filter_by_weekly_pay_rate = params[:pay_rate_filter] == 'weekly'

      respond_to do |format|
        format.html do
          render locals: {
            week: week,
            venue: venue,
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
          staff_members = FinanceReportStaffMembersQuery.new(
            venue: venue,
            start_date: week.start_date,
            end_date: week.end_date,
            filter_by_weekly_pay_rate: filter_by_weekly_pay_rate
          ).all

          render_finance_reports_pdf(
            week: week,
            venue: venue,
            staff_members: staff_members,
            filter_by_weekly_pay_rate: filter_by_weekly_pay_rate
          )
        end
      end
    else
      redirect_to(finance_reports_path(index_redirect_params))
    end
  end

  def render_finance_reports_pdf(week:, venue:, filter_by_weekly_pay_rate:, staff_members:)
    authorize!(:view, :finance_reports)

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
    filename  = "#{venue.name.parameterize}_finance_report_#{timestamp_start}_#{timestamp_end}.pdf"
    headers['Content-Disposition'] = "attachment; filename=#{filename}"
    render text: pdf.render, content_type: 'application/pdf'
  end

  def create
    authorize!(:complete, :finance_reports)

    week = week_from_params
    staff_member = staff_member_from_params
    venue = staff_member.master_venue

    SaveFinanceReport.new(
      staff_member: staff_member,
      week: week
    ).call

    flash[:success] = 'Report marked successfully'
    redirect_to(
      finance_reports_path(
        week_start: UIRotaDate.format(week.start_date),
        venue_id: venue.id
      )
    )
  end

  def complete_multiple
    authorize!(:complete, :finance_reports)

    week = week_from_params
    staff_members = staff_members_from_params
    venue = staff_members.first.master_venue

    SaveFinanceReports.new(
      staff_members: staff_members,
      week: week
    ).call

    flash[:success] = 'Reports marked successfully'
    redirect_to(
      finance_reports_path(
        week_start: UIRotaDate.format(week.start_date),
        venue_id: venue.id
      )
    )
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
    RotaWeek.new(UIRotaDate.parse(params[:id])) if params[:id].present?
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

  def reports_by_staff_type(week:, staff_members:)
    result = {}
    staff_members.each do |staff_member|
      result[staff_member.staff_type] ||= []
      result[staff_member.staff_type] << (FinanceReport.find_by(
        staff_member: staff_member,
        week_start: week.start_date
      ) || GenerateFinanceReportData.new(
        staff_member: staff_member,
        week: week
      ).call.report)
    end
    result
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
