class UsersController < ApplicationController
  before_action :authorize_admin, except: [:new_staff_member, :create_staff_member]

  def show
    user = User.find(params[:id])
    render locals: { user: user }
  end

  def index
    filter = UsersIndexFilter.new(params[:filter])
    users = filter.query.all.
      paginate(page: params[:page], per_page: 25)

    render locals: { filter: filter, users: users }
  end

  def edit_access_details
    user = User.find(params[:id])
    render locals: { user: user }
  end

  def update_access_details
    user = User.find(params[:id])
    assert_update_permitted(user)

    if user.update_attributes(user_access_details_params)
      flash[:success] = 'User updated successfully'
      redirect_to user_path(user)
    else
      flash.now[:error] = 'There was an issue updating this user'
      render 'edit_access_details', locals: { user: user }
    end
  end

  def edit_personal_details
    user = User.find(params[:id])
    render locals: { user: user }
  end

  def update_personal_details
    user = User.find(params[:id])
    assert_update_permitted(user)

    if user.update_attributes(user_personal_details_params(user))
      flash[:success] = 'User updated successfully'
      redirect_to user_path(user)
    else
      flash.now[:error] = 'There was an issue updating this user'
      render 'edit_personal_details', locals: { user: user }
    end
  end

  def new_staff_member
    user = User.find(params[:id])
    authorize! :create_staff_member, user

    staff_member = StaffMember.new(
      starts_at: Time.zone.now,
      email_address: user.email_address,
      name: user.name
    )

    render locals: { staff_member: staff_member, user: user }
  end

  def create_staff_member
    user = User.find(params[:id])
    authorize! :create_staff_member, user

    result = CreateStaffMemberFromUser.new(
      user: user,
      params: staff_member_params(user)
    ).call

    if result.success?
      flash[:success] = 'Staff member added successfully'
      redirect_to user_path(result.user)
    else
      flash.now[:error] = "There was a problem creating this staff member"
      render 'new_staff_member', locals: { staff_member: result.staff_member, user: result.user }
    end
  end

  def undestroy
    user = User.find(params[:id])
    authorize!(:enable, user)

    ReviveUser.new(
      requester: current_user,
      user: user
    ).call

    flash[:success] = "User enabled successfully"
    redirect_to user_path(user)
  end

  def disable
    user = User.find(params[:id])
    authorize!(:disable, user)

    form = DisableStaffMemberForm.new(OpenStruct.new)
    render locals: {
      user: user,
      form: form
    }
  end

  def destroy
    user = User.find(params[:id])
    authorize!(:disable, user)

    form = DisableStaffMemberForm.new(OpenStruct.new)
    result = form.validate(params["disable_staff_member"])
    if result
      disable_reason = form.disable_reason
      would_rehire = !ActiveRecord::Type::Boolean.new.type_cast_from_user(form.never_rehire)

      DeleteUser.new(
        requester: current_user,
        user: user,
        would_rehire: would_rehire,
        disable_reason: disable_reason
      ).call

      flash[:success] = "User disabled successfully"
      redirect_to users_path
    else
      flash.now[:error] = "There was a problem disabling this user"
      render 'disable', locals: {
        user: user,
        form: form
      }
    end
  end

  private
  def assert_update_permitted(user)
    raise 'Attempt to update disabled user' if user.disabled?
  end

  def authorize_admin
    if !can?(:manage, :admin)
      redirect_to root_path
    end
  end

  def user_personal_details_params(user)
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

  def user_access_details_params
    result = params.
      require(:user).
      permit(
        :role,
        :venues
      )

    if result[:role] == 'manager'
      result = result.merge(
        venues: venues_from_params
      )
    end

    result
  end

  def staff_member_params(user)
    permit_attributes = [
      :pin_code,
      :gender,
      :phone_number,
      :date_of_birth,
      :national_insurance_number,
      :hours_preference_note,
      :day_perference_note,
      :avatar_base64,
      :staff_type,
      :starts_at,
      :employment_status_a,
      :employment_status_b,
      :employment_status_c,
      :employment_status_d,
      :employment_status_p45_supplied
    ]

    permit_attributes << :pay_rate_id if pay_rate_from_params.andand.editable_by?(current_user)

    permit_attributes << {
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
    }

    staff_type = staff_type_from_params
    if staff_type.andand.security?
      permit_attributes << :sia_badge_number
      permit_attributes << :sia_badge_expiry_date
    end

    result = params.require(:staff_member).permit(
      permit_attributes
    ).merge(
      employment_status_statement_completed: true,
      staff_type: staff_type,
      name: user.name,
      email_address: user.email_address,
      creator: current_user,
      master_venue: staff_member_master_venue_from_params,
      work_venues: staff_member_work_venues_from_params
    )

    if result[:avatar_base64].present?
      result = result.merge(avatar_data_uri: result[:avatar_base64])
    end

    result
  end

  def pay_rate_from_params
    PayRate.find_by(id: params[:staff_member][:pay_rate_id])
  end

  def staff_type_from_params
    StaffType.find_by(id: params[:staff_member][:staff_type])
  end

  def venues_from_params
    Array(params[:user][:venues]).reject(&:blank?).map{|id| Venue.find(id) }
  end

  def staff_member_master_venue_from_params
    Venue.find_by(id: params[:staff_member][:master_venue])
  end

  def staff_member_work_venues_from_params
    Array(params[:staff_member][:work_venues]).reject(&:blank?).map{|id| Venue.find(id) }
  end
end
