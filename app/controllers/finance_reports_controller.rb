class FinanceReportsController < ApplicationController
  def index
    authorize! :manage, :admin

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
    authorize! :manage, :admin

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
    authorize! :manage, :admin
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

  def week_from_params
    if params[:week_start].present?
      RotaWeek.new(UIRotaDate.parse(params[:week_start]))
    end
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
