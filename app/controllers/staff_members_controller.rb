class StaffMembersController < ApplicationController
  def index
    authorize! :manage, :staff_members

    filter = StaffMemberIndexFilter.new(params[:filter])
    staff_members = filter.query.all

    render locals: {
      staff_members: staff_members,
      filter: filter
    }
  end

  def show
    staff_member = StaffMember.find(params[:id])
    authorize! :manage, staff_member

    render locals: { staff_member: staff_member }
  end

  def new
    authorize! :manage, :staff_members

    staff_member = StaffMember.new
    render locals: { staff_member: staff_member }
  end

  def create
    authorize! :manage, :staff_members

    staff_member = StaffMember.new(staff_member_params)
    if staff_member.staff_member_venue.present? && staff_member.staff_member_venue.venue_id == nil
      staff_member.staff_member_venue.mark_for_destruction
    end

    if staff_member.save
      flash[:success] = "Staff member added successfully"
      redirect_to action: :index
    else
      flash.now[:error] = "There was a problem creating this staff member"
      render 'new', locals: { staff_member: staff_member }
    end
  end

  def edit_employment_details
    staff_member = StaffMember.find(params[:id])
    render locals: { staff_member: staff_member }
  end

  private
  def staff_member_params
    params.require(:staff_member).permit(
      :pin_code,
      :gender,
      :phone_number,
      :date_of_birth,
      :national_insurance_number,
      :hours_preference_note,
      :day_perference_note,
      :avatar,
      :avatar_cache,
      :staff_type,
      address_attributes: [
        :address_1,
        :address_2,
        :address_3,
        :address_4,
        :postcode,
        :country,
        :region
      ],
      email_address_attributes: :email,
      name_attributes: [
        :first_name,
        :surname
      ],
      staff_member_venue_attributes: [:venue_id]
    ).merge(
      staff_type: staff_type_from_params,
      creator: current_user
    )
  end

  def staff_type_from_params
    StaffType.find_by(id: params[:staff_member][:staff_type])
  end
end
