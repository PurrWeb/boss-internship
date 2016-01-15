class UsersController < ApplicationController
  before_action :authorize_admin, except: [:new_staff_member, :create_staff_member]

  def show
    user = User.find(params[:id])
    render locals: { user: user }
  end

  def index
    filter = UsersIndexFilter.new(params[:filter])
    users = filter.query.all
    render locals: { filter: filter, users: users }
  end

  def edit_personal_details
    user = User.find(params[:id])
    render locals: { user: user }
  end

  def update_personal_details
    user = User.find(params[:id])
    if user.update_attributes(user_params(user))
      flash[:success] = 'User updated successfully'
      redirect_to user_path(user)
    else
      flash.now[:error] = 'There was an issue updating this user'
      render 'edit_personal_details', locals: { user: user }
    end
  end

  def new_staff_member
    authorize! :manage, StaffMember

    user = User.find(params[:id])

    staff_member = StaffMember.new(
      email_address: user.email_address,
      name: user.name
    )

    render locals: { staff_member: staff_member, user: user }
  end

  def create_staff_member
    authorize! :manage, StaffMember

    user = User.find(params[:id])
    staff_member = StaffMember.new(staff_member_params(user))

    if staff_member.save
      flash[:success] = 'Staff member added successfully'
      redirect_to user_path(user)
    else
      flash.now[:error] = "There was a problem creating this staff member"
      render 'new_staff_member', locals: { staff_member: staff_member, user: user }
    end
  end

  private
  def authorize_admin
    authorize! :manage, :admin
  end

  def user_params(user)
    params.
      require(:user).
      permit(
        name_attributes: [:first_name, :surname],
        email_address_attributes: [:email]
      ).deep_merge(
        name_attributes: { id: user.name.id },
        email_address_attributes: { id: user.email_address.id }
      )
  end

  def staff_member_params(user)
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
      staff_member_venue_attributes: [:venue_id]
    ).merge(
      staff_type: staff_type_from_params,
      user: user,
      name: user.name,
      email_address: user.email_address,
      creator: current_user
    )
  end

  def staff_type_from_params
    StaffType.find_by(id: params[:staff_member][:staff_type])
  end
end
