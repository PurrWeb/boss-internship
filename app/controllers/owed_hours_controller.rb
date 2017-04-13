class OwedHoursController < ApplicationController
  def create
    query = StaffMember.where(id: params[:staff_member_id])
    query = QueryOptimiser.apply_optimisations(query, :staff_member_show)
    staff_member = query.first

    authorize! :view, StaffMember
    raise ActiveRecord::RecordNotFound.new unless staff_member.present?

    owed_hour = OwedHour.new
    owed_hour_form = CreateOwedHourForm.new(
      OwedHourViewModel.new(owed_hour), owed_hour_params(:create)
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

    update_owed_hour_form = UpdateOwedHourForm.new(
      OwedHourViewModel.new(owed_hour)
    )

    render locals: { update_owed_hour_form: update_owed_hour_form }
  end

  def update
    owed_hour = OwedHour.enabled.find(params[:id])
    authorize! :manage, owed_hour

    new_owed_hour = OwedHour.new(
      owed_hour.attributes.
        merge(id: nil, creator: current_user)
    )

    update_owed_hour_form = UpdateOwedHourForm.new(
      OwedHourViewModel.new(new_owed_hour),
      owed_hour_params(:update)
    )

    if update_owed_hour_form.valid?
      update_owed_hour_form.sync

      ImmutableOwedHourUpdate.new(
        requester: current_user,
        old_owed_hour: owed_hour,
        new_owed_hour: new_owed_hour
      ).call

      flash[:success] = "Owed hours updated successfully"
      redirect_to staff_member_path(owed_hour.staff_member, tab: 'owed-hours')
    else
      flash.now[:error] = "There was a problem updating these owed hours"

      render 'edit', locals: {
        update_owed_hour_form: update_owed_hour_form
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
  def owed_hour_params(action)
    params.
      require("#{action}_owed_hour").
      permit(
        :date,
        :starts_at_offset,
        :ends_at_offset,
        :note
      ).merge(
        date: date_from_params(action),
      )
  end

  def date_from_params(action)
    if params["#{action}_owed_hour"]['date'].present?
      UIRotaDate.parse(params["#{action}_owed_hour"]['date'])
    end
  end
end
