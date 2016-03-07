class StaffMembersController < ApplicationController
  def index
    authorize! :manage, :staff_members

    filter = StaffMemberIndexFilter.new(
      user: current_user,
      params: params[:filter]
    )
    staff_members = filter.query.all

    render locals: {
      staff_members: staff_members,
      filter: filter
    }
  end

  def show
    staff_member = StaffMember.find(params[:id])
    authorize! :manage, staff_member

    if !active_tab_from_params.present?
      return redirect_to staff_member_path(staff_member, tab: 'employment-details')
    end

    render locals: {
      staff_member: staff_member,
      active_tab: active_tab_from_params,
      holiday: Holiday.new
    }
  end

  def new
    authorize! :manage, :staff_members

    staff_member = StaffMember.new(starts_at: Time.now)
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
    authorize! :manage, staff_member

    render locals: { staff_member: staff_member }
  end

  def update_employment_details
    staff_member = StaffMember.find(params[:id])
    authorize! :manage, staff_member

    result = UpdateStaffMemberEmploymentDetails.new(
      staff_member: staff_member,
      params: update_employment_details_params(staff_member)
    ).call

    if result.success?
      flash[:success] = "Staff member updated successfully"
      redirect_to staff_member_path(result.staff_member, tab: 'employment-details')
    else
      flash.now[:error] = "There was a problem updating this staff member"
      render 'edit_employment_details', locals: { staff_member: result.staff_member }
    end
  end

  def edit_personal_details
    staff_member = StaffMember.find(params[:id])
    authorize! :manage, staff_member

    render locals: { staff_member: staff_member }
  end

  def update_personal_details
    staff_member = StaffMember.find(params[:id])
    authorize! :manage, staff_member

    if staff_member.update_attributes(update_personal_details_params)
      flash[:success] = "Staff member updated successfully"
      redirect_to staff_member_path(staff_member, tab: 'personal-details')
    else
      flash.now[:error] = "There was a problem updating this staff member"
      render 'edit_personal_details', locals: { staff_member: staff_member }
    end
  end

  def edit_avatar
    staff_member = StaffMember.find(params[:id])
    authorize! :manage, staff_member

    render locals: { staff_member: staff_member }
  end

  def update_avatar
    staff_member = StaffMember.find(params[:id])
    authorize! :manage, staff_member

    if staff_member.update_attributes(update_avatar_params)
      flash[:success] = "Staff member updated successfully"
      redirect_to staff_member_path(staff_member)
    else
      flash.now[:error] = "There was a problem updating this staff member"
      render 'edit_avatar', locals: { staff_member: staff_member }
    end
  end

  private
  def active_tab_from_params
    tab_from_params = params['tab']
    tab_from_params if show_page_tabs.include?(tab_from_params)
  end

  def show_page_tabs
    [
      'employment-details',
      'account-details',
      'personal-details',
      'contact-details',
      'holidays'
    ]
  end

  def staff_member_params
    require_attributes = [
      :pin_code,
      :gender,
      :phone_number,
      :date_of_birth,
      :starts_at,
      :national_insurance_number,
      :hours_preference_note,
      :avatar_base64,
      :day_perference_note,
      :employment_status_a,
      :employment_status_b,
      :employment_status_c,
      :employment_status_d,
      name_attributes: [
        :first_name,
        :surname
      ],
      staff_member_venue_attributes: [:venue_id]
    ]

    require_attributes << :staff_type if !current_user.security_manager?

    require_attributes << :pay_rate_id if pay_rate_from_params.andand.editable_by?(current_user)

    require_attributes << {
      address_attributes: [
        :address_1,
        :address_2,
        :address_3,
        :address_4,
        :postcode,
        :country,
        :region
      ]
    } if address_params_present?

    require_attributes << {
      email_address_attributes: :email
    } if email_params_present?

    staff_type = current_user.security_manager? ? StaffType.security.first : staff_type_from_params

    if staff_type.andand.security?
      require_attributes << :sia_badge_number
      require_attributes << :sia_badge_expiry_date
    end

    result = params.
      require(:staff_member).
      permit(
        require_attributes
      ).merge(
        creator: current_user
      )

    if result[:avatar_base64].present?
      result = result.merge(avatar_data_uri: result[:avatar_base64])
    end

    result = result.merge(staff_type: staff_type)

    result
  end

  def email_params_present?
    params["staff_member"]["email_address_attributes"].present?
  end

  def address_params_present?
    Array(params["staff_member"]["address_attributes"].try(:values)).join("").present?
  end

  def update_avatar_params
    result = params.require(:staff_member).permit(:avatar_base64)

    if result[:avatar_base64].present?
      result = result.merge(avatar_data_uri: result[:avatar_base64])
    end

    result
  end

  def update_employment_details_params(staff_member)
    allowed_params = [
        :national_insurance_number,
        :hours_preference_note,
        :day_perference_note,
        :starts_at,
        :employment_status_a,
        :employment_status_b,
        :employment_status_c,
        :employment_status_d,
        :pay_rate_id
    ]

    allowed_params << :staff_type if !current_user.security_manager?

    allowed_params << :pay_rate_id if pay_rate_from_params.andand.editable_by?(current_user)

    allowed_params << { staff_member_venue_attributes: [:venue_id] }

    staff_type = current_user.security_manager? ? StaffType.security.first : staff_type_from_params

    if staff_type.andand.security?
      allowed_params << :sia_badge_number
      allowed_params << :sia_badge_expiry_date
    end

    result = params.require(:staff_member).
      permit(
        *allowed_params
      ).deep_merge(
        staff_member_venue_attributes: {
          id: staff_member.staff_member_venue.try(:id)
        }
      )

    result = result.merge(staff_type: staff_type) if !current_user.security_manager?

    result
  end

  def update_personal_details_params
    params.require(:staff_member).
      permit(
        :gender,
        :date_of_birth,
        name_attributes: [
          :first_name,
          :surname
        ]
      )
  end

  def pay_rate_from_params
    PayRate.find_by(id: params[:staff_member][:pay_rate_id])
  end

  def staff_type_from_params
    StaffType.find_by(id: params[:staff_member][:staff_type])
  end
end
