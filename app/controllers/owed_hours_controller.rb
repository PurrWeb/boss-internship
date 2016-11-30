class OwedHoursController < ApplicationController
  def create
    query = StaffMember.where(id: params[:staff_member_id])
    query = QueryOptimiser.apply_optimisations(query, :staff_member_show)
    staff_member = query.first

    authorize! :view, StaffMember
    raise ActiveRecord::RecordNotFound.new unless staff_member.present?

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

    edit_owed_hour_form = EditOwedHourForm.new(
      OwedHourViewModel.new(owed_hour)
    )

    render locals: { edit_owed_hour_form: edit_owed_hour_form }
  end

  def update
    owed_hour = OwedHour.enabled.find(params[:id])
    authorize! :manage, owed_hour

    edit_owed_hour_form = EditOwedHourForm.new(
      OwedHourViewModel.new(owed_hour),
      update_owed_hour_params
    )

    if edit_owed_hour_form.valid?
      normalised_update_attributes = {}

       edit_owed_hour_form.save do |attributes|
        attributes.each do |key, value|
          next if [:minutes, :hours].include?(key.to_sym)
          normalised_update_attributes[key.to_sym] = value
        end

        normalised_update_attributes[:minutes] = HoursHelper.
          total_minutes_from_hours_and_minutes(
              hours: attributes[:hours],
              minutes: attributes[:minutes]
          )
      end
      new_owed_hour = OwedHour.new(
        normalised_update_attributes.
          merge(
            creator: current_user,
            staff_member: owed_hour.staff_member
          )
      )

      EditOwedHour.new(
        requester: current_user,
        old_owed_hour: owed_hour,
        new_owed_hour: new_owed_hour
      ).call

      flash[:success] = "Owed hours updated successfully"
      redirect_to staff_member_path(owed_hour.staff_member, tab: 'owed-hours')
    else
      flash.now[:error] = "There was a problem updating these owed hours"

      render 'edit', locals: {
        edit_owed_hour_form: edit_owed_hour_form
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
        week_start_date: week_start_date_from_params(:create),
      )
  end

  def update_owed_hour_params
    params.
      require(:edit_owed_hour).
      permit(
        :hours,
        :minutes,
        :note
      ).merge(
        week_start_date: week_start_date_from_params(:edit),
      )
  end

  def week_start_date_from_params(action)
    if params["#{action}_owed_hour"]['week_start_date'].present?
      UIRotaDate.parse(params["#{action}_owed_hour"]['week_start_date'])
    end
  end
end
