class HolidaysController < ApplicationController
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
      redirect_to holidays_path(date: UIRotaDate.format(Time.zone.now.to_date), venue: venue)
      return
    end

    week = RotaWeek.new(date)

    holidays_reports_data = HolidayReportsDataQuery.new(week: week, venues: query_venues)

    respond_to do |format|
      format.html do
        render locals: {
          week: week,
          holidays: holidays_reports_data.holidays,
          staff_members: holidays_reports_data.staff_members,
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
    staff_member = StaffMember.find(params[:staff_member_id])
    authorize! :edit, staff_member

    result = CreateHoliday.new(
      requester: current_user,
      params: holiday_params.
        merge(staff_member: staff_member, creator: current_user)
    ).call

    owed_hour = OwedHour.new
    owed_hours_week = RotaWeek.new(RotaShiftDate.to_rota_date(Time.current))

    if result.success?
      flash[:success] = "Holiday added successfully"
      redirect_to staff_member_path(staff_member, tab: 'holidays')
    else
      flash.now[:error] = "There was a problem creating this holiday"
      js 'StaffMembers#show'

      render 'staff_members/show', locals: {
        staff_member: staff_member,
        active_tab: 'holidays',
        owed_hour: owed_hour,
        owed_hours_week: owed_hours_week,
        holiday: result.holiday
      }
    end
  end

  def edit
    holiday = Holiday.find(params[:id])
    authorize! :manage, holiday

    render locals: { holiday: holiday }
  end

  def update
    holiday = Holiday.find(params[:id])
    staff_member = holiday.staff_member
    authorize! :manage, holiday

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

    authorize! :manage, holiday

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
