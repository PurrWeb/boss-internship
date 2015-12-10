class StaffMembersController < ApplicationController
  def index
    staff_members = StaffMember.all
    render locals: { staff_members: staff_members }
  end

  def new
    staff_member = StaffMember.new
    render locals: { staff_member: staff_member }
  end

  def create
    staff_member = StaffMember.new(staff_member_params)

    if staff_member.save
      flash[:message] = "Staff member added successfully"
      redirect_to action: :index
    else
      flash.now[:error] = "There was a problem creating this staff member"
      render 'new', locals: { staff_member: staff_member }
    end
  end

  private
  def staff_member_params
    params.require(:staff_member).permit(
      :email,
      :gender,
      :phone_number,
      :date_of_birth,
      :national_insurance_number,
      :hours_preference_note,
      :day_perference_note,
      address_attributes: [
        :address_1,
        :address_2,
        :address_3,
        :address_4,
        :postcode,
        :country,
        :region
      ],
      name_attributes: [
        :first_name,
        :surname
      ]
    )
  end
end
