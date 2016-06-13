class OldHoursController < ApplicationController
  def create
    authorize! :manage, :admin
    staff_member = StaffMember.find(params[:staff_member_id])

    old_hour = OldHour.new(
      old_hour_params.
      merge(
        staff_member: staff_member,
        creator: current_user
      )
    )

    if old_hour.save
      flash[:success] = "Hours added successfully"
      redirect_to staff_member_path(staff_member, tab: 'old-hours')
    else
      flash.now[:error] = "There was a problem creating these hours"

      old_hours_week = RotaWeek.new(Time.current)
      holiday = Holiday.new

      render 'staff_members/show', locals: {
        staff_member: staff_member,
        active_tab: 'old-hours',
        old_hour: old_hour,
        old_hours_week: old_hours_week,
        holiday: holiday
      }
    end
  end

  def edit
    old_hour = OldHour.find(params[:id])
    authorize! :manage, old_hour

    render locals: { old_hour: old_hour }
  end

  def update
    old_hour = OldHour.find(params[:id])
    authorize! :manage, old_hour

    result = EditOldHour.new(
      requester: current_user,
      old_hour: old_hour,
      params: old_hour_params
    ).call

    if result.success?
      flash[:success] = "Old hours updated successfully"
      redirect_to staff_member_path(result.old_hour.staff_member, tab: 'old-hours')
    else
      flash.now[:error] = "There was a problem updating these old hours"

      render 'edit', locals: {
        old_hour: result.old_hour
      }
    end
  end

  def destroy
    old_hour = OldHour.find(params[:id])
    authorize! :manage, old_hour

    DeleteOldHour.new(
      requester: current_user,
      old_hour: old_hour
    ).call

    flash[:success] = 'Old hour deleted successfully'
    redirect_to staff_member_path(old_hour.staff_member, tab: 'old-hours')
  end

  private
  def old_hour_params
    params.
      require(:old_hour).
      permit(
        :minutes,
        :note
      ).merge(
        week_start_date: week_start_date_from_params,
      )
  end

  def week_start_date_from_params
    if params['old_hour']['week_start_date'].present?
      UIRotaDate.parse(params['old_hour']['week_start_date'])
    end
  end
end
