class OwedHoursController < ApplicationController
  def create
    staff_member = StaffMember.find(params[:staff_member_id])
    authorize! :view, StaffMember

    result = CreateOwedHour.new(
      requester: current_user,
      params: owed_hour_params.
        merge(
          staff_member: staff_member,
          creator: current_user
        )
    ).call

    if result.success?
      flash[:success] = "Hours added successfully"
      redirect_to staff_member_path(staff_member, tab: 'owed-hours')
    else
      flash.now[:error] = "There was a problem creating these hours"

      owed_hours_week = RotaWeek.new(RotaShiftDate.to_rota_date(Time.current))
      holiday = Holiday.new

      render 'staff_members/show', locals: {
        staff_member: staff_member,
        active_tab: 'owed-hours',
        owed_hour: result.owed_hour,
        owed_hours_week: owed_hours_week,
        holiday: holiday
      }
    end
  end

  def edit
    owed_hour = OwedHour.enabled.find(params[:id])
    authorize! :manage, owed_hour

    render locals: { owed_hour: owed_hour }
  end

  def update
    owed_hour = OwedHour.enabled.find(params[:id])
    authorize! :manage, owed_hour

    result = EditOwedHour.new(
      requester: current_user,
      owed_hour: owed_hour,
      params: owed_hour_params
    ).call

    if result.success?
      flash[:success] = "Owed hours updated successfully"
      redirect_to staff_member_path(result.owed_hour.staff_member, tab: 'owed-hours')
    else
      flash.now[:error] = "There was a problem updating these owed hours"

      render 'edit', locals: {
        owed_hour: result.owed_hour
      }
    end
  end

  def destroy
    owed_hour = OwedHour.enabled.find(params[:id])
    authorize! :manage, owed_hour

    result = DeleteOwedHour.new(
      requester: current_user,
      owed_hour: owed_hour
    ).call

    if result.success?
      flash[:success] = 'Owed hour deleted successfully'
      redirect_to staff_member_path(owed_hour.staff_member, tab: 'owed-hours')
    else
      flash[:error] = "There was a problem deleting these hours"
      render 'edit', locals: { owed_hour: result.owed_hour }
    end
  end

  private
  def owed_hour_params
    params.
      require(:owed_hour).
      permit(
        :minutes,
        :note
      ).merge(
        week_start_date: week_start_date_from_params,
      )
  end

  def week_start_date_from_params
    if params['owed_hour']['week_start_date'].present?
      UIRotaDate.parse(params['owed_hour']['week_start_date'])
    end
  end
end
