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

  def edit
    holiday = Holiday.find(params[:id])
    staff_member = holiday.staff_member
    authorize! :manage, staff_member

    render locals: { holiday: holiday }
  end

  def update
    holiday = Holiday.find(params[:id])
    staff_member = holiday.staff_member
    authorize! :manage, staff_member

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
    authorize! :manage, staff_member

    holiday = staff_member.holidays.in_state(:enabled).where(id: params[:id]).first
    raise ActiveRecord::RecordNotFound unless holiday.present?

    DeleteHoliday.new(
      requester: current_user,
      holiday: holiday
    ).call

    flash[:success] = "Holiday deletedsuccessfully"
    redirect_to staff_member_path(staff_member, tab: 'holidays')
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
    parse_date_thing(params['holiday'], 'start_date')
  end

  def end_date_from_params
    parse_date_thing(params['holiday'], 'end_date')
  end

  def parse_date_thing(hash ,field_name)
    year = hash["#{field_name}(1i)"]
    month = hash["#{field_name}(2i)"]
    day = hash["#{field_name}(3i)"]

    if year.present? && month.present? && day.present?
      Date.new(Integer(year), Integer(month), Integer(day)).to_date
    end
  end
end
