class StaffMembersController < ApplicationController
  def index
    authorize! :manage, :staff_members

    filter = StaffMemberIndexFilter.new(
      user: current_user,
      params: params[:staff_member_index_filter]
    )
    staff_members = filter.
      query.
      all.
      includes(:name).
      includes(:staff_type).
      includes(:master_venue).
      includes(:work_venues).
      paginate(page: params[:page], per_page: 20)

    render locals: {
      staff_members: staff_members,
      filter: filter
    }
  end

  def flagged
    authorize! :manage, :staff_members

    filter = StaffMemberIndexFilter.new(
      user: current_user,
      params: Hash(params[:staff_member_index_filter]).merge(status: nil)
    )

    staff_members = filter.
      query(relation: StaffMember.flagged).all.
      paginate(page: params[:page], per_page: 20)

    render locals: {
      staff_members: staff_members,
      filter: filter
    }
  end

  def show
    staff_member = StaffMember.
      includes(holidays: {creator: [:name]}).
      includes(:owed_hours).
      includes(:name).
      find(params[:id])

    if can? :edit, staff_member
      if !active_tab_from_params.present?
        return redirect_to staff_member_path(staff_member, tab: 'employment-details')
      end

      owed_hours_week = RotaWeek.new(Time.current)
      owed_hour = OwedHour.new(
        minutes: 0,
      )

      render locals: {
        staff_member: staff_member,
        active_tab: active_tab_from_params,
        holiday: Holiday.new,
        owed_hours_week: owed_hours_week,
        owed_hour: owed_hour
      }
    else
      flash.now[:alert] = "You're not authorized to view all of this staff member's details. Contact an admin for further assistance."

      render 'reduced_show', locals: {
        staff_member: staff_member
      }
    end
  end

  def new
    authorize! :manage, :staff_members

    staff_member = StaffMember.new(starts_at: Time.zone.now)
    render locals: { staff_member: staff_member }
  end

  def create
    authorize! :manage, :staff_members

    result = CreateStaffMember.new(params: staff_member_params).call

    if result.success?
      flash[:success] = "Staff member added successfully"
      redirect_to action: :index
    else
      flash.now[:error] = "There was a problem creating this staff member"
      render 'new', locals: { staff_member: result.staff_member }
    end
  end

  def edit_employment_details
    staff_member = StaffMember.find(params[:id])
    authorize! :edit, staff_member

    render locals: { staff_member: staff_member }
  end

  def update_employment_details
    staff_member = StaffMember.find(params[:id])
    authorize! :edit, staff_member
    assert_update_permitted(staff_member)

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
    authorize! :edit, staff_member

    render locals: { staff_member: staff_member }
  end

  def update_personal_details
    staff_member = StaffMember.find(params[:id])
    authorize! :edit, staff_member
    assert_update_permitted(staff_member)

    result = UpdateStaffMemberPersonalDetails.new(
      staff_member: staff_member,
      params: update_personal_details_params
    ).call

    if result.success?
      flash[:success] = "Staff member updated successfully"
      redirect_to staff_member_path(result.staff_member, tab: 'personal-details')
    else
      flash.now[:error] = "There was a problem updating this staff member"
      render 'edit_personal_details', locals: { staff_member: result.staff_member }
    end
  end

  def edit_contact_details
    staff_member = StaffMember.find(params[:id])
    authorize! :edit, staff_member

    render locals: { staff_member: staff_member }
  end

  def update_contact_details
    staff_member = StaffMember.find(params[:id])
    authorize! :edit, staff_member
    assert_update_permitted(staff_member)

    result = UpdateStaffMemberContactDetails.new(
      staff_member: staff_member,
      email: update_contact_details_params.fetch("email_address_attributes").fetch("email"),
      phone_number: update_contact_details_params.fetch("phone_number"),
      address: Address.new(update_contact_details_params.fetch("address_attributes"))
    ).call

    if result.success?
      flash[:success] = "Staff member updated successfully"
      redirect_to staff_member_path(result.staff_member, tab: 'contact-details')
    else
      flash.now[:error] = "There was a problem updating this staff member"
      render 'edit_contact_details', locals: { staff_member: result.staff_member }
    end
  end

  def edit_avatar
    staff_member = StaffMember.find(params[:id])
    authorize! :edit, staff_member

    render locals: { staff_member: staff_member }
  end

  def update_avatar
    staff_member = StaffMember.find(params[:id])
    authorize! :edit, staff_member
    assert_update_permitted(staff_member)

    if staff_member.update_attributes(update_avatar_params)
      flash[:success] = "Staff member updated successfully"
      redirect_to staff_member_path(staff_member)
    else
      flash.now[:error] = "There was a problem updating this staff member"
      render 'edit_avatar', locals: { staff_member: staff_member }
    end
  end

  def enable
    staff_member = StaffMember.find(params[:id])
    authorize! :enable, staff_member

    render locals: {
      staff_member: staff_member
    }
  end

  def undestroy
    staff_member = StaffMember.find(params[:id])
    authorize! :enable, staff_member

    result = ReviveStaffMember.new(
      requester: current_user,
      staff_member: staff_member,
      staff_member_params: enable_params(staff_member)
    ).call

    if result.success?
      flash[:success] = "Staff Member enabled successfully"
      redirect_to staff_member_path(staff_member)
    else
      flash.now[:error] = "There was a problem enabling this staff member"
      render 'enable', locals: { staff_member: result.staff_member }
    end
  end

  def disable
    staff_member = StaffMember.find(params[:id])
    authorize! :disable, staff_member

    form = DisableStaffMemberForm.new(OpenStruct.new)
    render locals: {
      staff_member: staff_member,
      form: form
    }
  end

  def destroy
    staff_member = StaffMember.find(params[:id])
    authorize! :disable, staff_member

    form = DisableStaffMemberForm.new(OpenStruct.new)
    result = form.validate(params["disable_staff_member"])

    if result
      disable_reason = form.disable_reason
      would_rehire = !ActiveRecord::Type::Boolean.new.type_cast_from_user(form.never_rehire)

      DeleteStaffMember.new(
        requester: current_user,
        staff_member: staff_member,
        would_rehire: would_rehire,
        disable_reason: disable_reason
      ).call

      flash[:success] = "Staff member disabled successfully"
      redirect_to staff_members_path
    else
      flash.now[:error] = "There was a problem disabling this staff member"
      render 'disable', locals: {
        staff_member: staff_member,
        form: form
      }
    end
  end

  private
  def assert_update_permitted(staff_member)
    raise 'Attempt to update disabled staff_member' if staff_member.disabled?
  end

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
      'owed-hours',
      'holidays'
    ]
  end

  def enable_params(staff_member)
    staff_member_params
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
      :employment_status_p45_supplied,
      name_attributes: [
        :first_name,
        :surname
      ]
    ]

    require_attributes << :staff_type if !current_user.security_manager?

    require_attributes << :pay_rate_id if pay_rate_from_params.andand.selectable_by?(current_user)

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
        master_venue: master_venue_from_params,
        work_venues: work_venues_from_params,
        creator: current_user,
        employment_status_statement_completed: true
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
        :employment_status_p45_supplied,
        :pay_rate_id
    ]

    allowed_params << :staff_type if !current_user.security_manager?

    allowed_params << :pay_rate_id if pay_rate_from_params.andand.editable_by?(current_user)

    staff_type = current_user.security_manager? ? StaffType.security.first : staff_type_from_params

    if staff_type.andand.security?
      allowed_params << :sia_badge_number
      allowed_params << :sia_badge_expiry_date
    end

    result = params.require(:staff_member).
      permit(
        *allowed_params
      ).deep_merge(
        employment_status_statement_completed: true,
        master_venue: master_venue_from_params,
        work_venues: work_venues_from_params
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

  def update_contact_details_params
    params.require(:staff_member).
      permit(
        :phone_number,
        address_attributes: [
          :address_1,
          :address_2,
          :address_3,
          :address_4,
          :postcode,
          :country,
          :region
        ],
        email_address_attributes: :email
      )
  end

  def pay_rate_from_params
    PayRate.find_by(id: params[:staff_member][:pay_rate_id])
  end

  def staff_type_from_params
    StaffType.find_by(id: params[:staff_member][:staff_type])
  end

  def work_venues_from_params
    Array(params[:staff_member][:work_venues]).reject(&:blank?).map do |id|
      Venue.find(id)
    end
  end

  def master_venue_from_params
    Venue.find_by(id: params[:staff_member][:master_venue])
  end
end
