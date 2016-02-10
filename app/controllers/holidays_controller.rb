class HolidaysController < ApplicationController
  def create
    staff_member = StaffMember.find(params[:staff_member_id])
    authorize! :manage, staff_member

    holiday = Holiday.new(
      holiday_params.
        merge(staff_member: staff_member, creator: current_user)
    )

    if holiday.save
      flash[:success] = "Holiday added successfully"
      redirect_to staff_member_path(staff_member, tab: 'holidays')
    else
      flash.now[:error] = "There was a problem creating this holiday"
      js 'StaffMembers#show'

      render 'staff_members/show', locals: {
        staff_member: staff_member,
        active_tab: 'holidays',
        holiday: holiday
      }
    end
  end

  private
  def holiday_params
    params.
      require(:holiday).
      permit(
        :start_date,
        :end_date,
        :holiday_type,
        :note
      )
  end
end
