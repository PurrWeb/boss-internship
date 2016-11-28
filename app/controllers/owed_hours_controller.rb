class OwedHoursController < ApplicationController
  def create
    staff_member = StaffMember.find(params[:staff_member_id])
    authorize! :view, StaffMember

    owed_hour = OwedHour.new
    owed_hour_form = CreateOwedHourForm.new(
      OwedHourViewModel.new(owed_hour), create_owed_hour_params
    )
    owed_hour.creator = current_user
    owed_hour.staff_member = staff_member

    if owed_hour_form.valid?
      # Reform save! doesn't work
      if !owed_hour_form.save
        raise ActiveRecord::RecordInvalid.new(
          owed_hour_form.model.model
        )
      end

      flash[:success] = "Hours added successfully"
      redirect_to staff_member_path(staff_member, tab: 'owed-hours')
    else
      flash.now[:error] = "There was a problem creating these hours"

      holiday = Holiday.new
      render 'staff_members/show', locals: {
        staff_member: staff_member,
        active_tab: 'owed-hours',
        owed_hour_form: owed_hour_form,
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
      params: edit_owed_hour_params
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
  def create_owed_hour_params
    params.
      require(:create_owed_hour).
      permit(
        :hours,
        :minutes,
        :note
      ).merge(
        week_start_date: week_start_date_from_params,
      )
  end

  def edit_owed_hour_params
    params.
      require(:edit_owed_hour).
      permit(
        :hours,
        :minutes,
        :note
      ).merge(
        week_start_date: week_start_date_from_params,
      )
  end

  def week_start_date_from_params
    if params['create_owed_hour']['week_start_date'].present?
      UIRotaDate.parse(params['create_owed_hour']['week_start_date'])
    end
  end
end
