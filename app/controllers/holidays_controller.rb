class HolidaysController < ApplicationController
  before_action :set_new_layout, only: [:index]

  def index
    authorize!(:view, :holidays)

    access_token = current_user.current_access_token || AccessToken.create_web!(user: current_user)

    query_venues = nil
    filter_venue = Venue.find_by(id: params[:venue])
    accessible_venues = AccessibleVenuesQuery.new(current_user).all

    if filter_venue
      authorize!(:manage, filter_venue)
      query_venues = Venue.where(id: filter_venue.id)
    else
      query_venues = accessible_venues
    end

    if params[:date]
      date = UIRotaDate.parse(params[:date])
    else
      redirect_to holidays_path(date: UIRotaDate.format(Time.zone.now.to_date))
      return
    end

    week = RotaWeek.new(date)

    holidays_reports_data = HolidayReportsDataQuery.new(week: week, venues: query_venues)

    holidays = holidays_reports_data.holidays.includes([:staff_member])
    staff_members = holidays_reports_data.
      staff_members.
      includes([:staff_type, :name, :master_venue])

    respond_to do |format|
      format.html do
        render locals: {
          week: week,
          holidays: holidays,
          staff_members: staff_members,
          accessible_venues: accessible_venues,
          staff_types: StaffType.all,
          filter_venue: filter_venue,
          access_token: access_token
        }
      end

      format.csv do
        authorize!(:view, :holidays_csv)

        csv = HolidayReportCSV.new(holidays_reports_data.holidays)
        #TODO: Extract File Timestamp Format to somewhere
        timestamp = week.start_date.strftime('%d-%b-%Y-%H-%M')
        filename  = "holiday-report-#{timestamp}.csv"
        headers['Content-Disposition'] = "attachment; filename=#{filename}"
        render text: csv.to_s, content_type: 'text/csv'
      end
    end
  end

  def create
    query = StaffMember.where(id: params[:staff_member_id])
    query = QueryOptimiser.apply_optimisations(query, :staff_member_show)
    staff_member = query.first
    raise ActiveRecord::RecordNotFound.new unless staff_member.present?

    authorize! :create, Holiday.new(staff_member: staff_member)

    result = CreateHoliday.new(
      requester: current_user,
      params: holiday_params.
        merge(staff_member: staff_member, creator: current_user)
    ).call

    if result.success?
      flash[:success] = "Holiday added successfully"
      redirect_to staff_member_path(staff_member, tab: 'holidays')
    else
      flash.now[:error] = "There was a problem creating this holiday"
      js 'StaffMembers#show'

      tax_year = TaxYear.new(RotaShiftDate.to_rota_date(Time.current))

      holidays_in_tax_year = HolidayInTaxYearQuery.new(
       relation: staff_member.active_holidays,
       tax_year: tax_year
      ).all.includes(:frozen_by)

      holiday_start_date = tax_year.start_date
      holiday_end_date = tax_year.end_date

      filtered_holidays = InRangeQuery.new(
        relation: staff_member.active_holidays,
        start_value: holiday_start_date,
        end_value: holiday_end_date,
        start_column_name: 'start_date',
        end_column_name: 'end_date'
      ).all

      paid_holiday_days = holidays_in_tax_year.paid.to_a.sum { |holiday| holiday.days }
      unpaid_holiday_days = holidays_in_tax_year.unpaid.to_a.sum { |holiday| holiday.days }
      estimated_accrued_holiday_days = AccruedHolidayEstimate.new(
        staff_member: staff_member,
        tax_year: tax_year
      ).call

      owed_hour_form = CreateOwedHourForm.new(OwedHourViewModel.new(OwedHour.new))

      render 'staff_members/show', locals: {
        staff_member: staff_member,
        active_tab: 'holidays',
        owed_hour_form: owed_hour_form,
        new_holiday: result.holiday,
        holidays: filtered_holidays,
        paid_holiday_days: paid_holiday_days,
        unpaid_holiday_days: unpaid_holiday_days,
        estimated_accrued_holiday_days: estimated_accrued_holiday_days,
        holiday_start_date: holiday_start_date,
        holiday_end_date: holiday_end_date
      }
    end
  end

  def edit
    holiday = Holiday.find(params[:id])
    authorize! :update, holiday

    render locals: { holiday: holiday }
  end

  def update
    holiday = Holiday.find(params[:id])
    staff_member = holiday.staff_member
    authorize! :update, holiday

    result = EditHoliday.new(
      requester: current_user,
      holiday: holiday,
      params: holiday_params
    ).call

    if result.success?
      flash[:success] = "Holiday updated successfully"
      redirect_to staff_member_path(staff_member, tab: 'holidays')
    else
      flash.now[:error] = "There was a problem updating this holiday"

      render 'edit', locals: {
        holiday: result.holiday
      }
    end
  end

  def destroy
    staff_member = StaffMember.find(params[:staff_member_id])
    holiday = staff_member.holidays.in_state(:enabled).where(id: params[:id]).first
    raise ActiveRecord::RecordNotFound unless holiday.present?

    authorize! :destroy, holiday

    result = DeleteHoliday.new(
      requester: current_user,
      holiday: holiday
    ).call

    if result.success?
      flash[:success] = "Holiday deleted successfully"
      redirect_to staff_member_path(staff_member, tab: 'holidays')
    else
      flash[:error] = "There was a problem deleting this holiday"
      render 'edit', locals: { holiday: result.holiday }
    end
  end

  private
  def holiday_params
    params.
      require(:holiday).
      permit(
        :holiday_type,
        :note
      ).merge(
        start_date: start_date_from_params,
        end_date: end_date_from_params
      )
  end

  def start_date_from_params
    if params['holiday']['start_date'].present?
      UIRotaDate.parse(params['holiday']['start_date'])
    end
  end

  def end_date_from_params
    if params['holiday']['end_date'].present?
      UIRotaDate.parse(params['holiday']['end_date'])
    end
  end
end
