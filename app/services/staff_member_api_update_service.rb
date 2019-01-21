# Responsibilities:
# * Control access to operations
# * Parse api params and pass them to model layer update services
# * return ApiErrors object for operations
class StaffMemberApiUpdateService
  class Result < Struct.new(:staff_member, :success, :api_errors)
    def success?
      success
    end
  end

  def initialize(staff_member:, requester:, frontend_updates:)
    @staff_member = staff_member
    @requester = requester
    @ability = UserAbility.new(requester)
    @frontend_updates = frontend_updates
  end

  attr_reader :staff_member, :requester, :ability, :frontend_updates

  def disable(params)
    assert_action_permitted(:disable)

    form = DisableStaffMemberForm.new(OpenStruct.new)
    form_valid = form.validate({
      disable_reason: params.fetch(:disable_reason),
      never_rehire: BooleanString.parse_boolean(params.fetch(:never_rehire)),
    })

    success = false
    if form_valid
      DeleteStaffMember.new(
        requester: requester,
        staff_member: staff_member,
        would_rehire: form.would_rehire,
        disable_reason: form.disable_reason,
        frontend_updates: frontend_updates,
      ).call
      success = true
    end

    api_errors = nil
    if success
      frontend_updates.update_staff_member_profile(staff_member: staff_member)
    else
      api_errors = DisableStaffMembersApiErrors.new(disable_staff_member_form: form)
    end

    Result.new(staff_member, success, api_errors)
  end

  def enable(starts_at:)
    assert_action_permitted(:enable)

    model_service_result = ReviveStaffMember.new(
      requester: requester,
      staff_member: staff_member,
      starts_at: starts_at,
    ).call

    api_errors = nil
    if model_service_result.success?
      frontend_updates.update_staff_member_profile(staff_member: staff_member)
    else
      api_errors = EnableStaffMemberApiErrors.new(staff_member: staff_member)
    end

    Result.new(staff_member, model_service_result.success?, api_errors)
  end

  def update_contact_details(params)
    assert_action_permitted(:update_contact_details)

    model_service_result = UpdateStaffMemberContactDetails.new(
      requester: requester,
      staff_member: staff_member,
      phone_number: params.fetch(:phone_number),
      address: Address.new(
        address: params.fetch(:address),
        postcode: params.fetch(:postcode),
        country: params.fetch(:country),
        county: params.fetch(:county),
      ),
      email: params.fetch(:email_address),
    ).call

    api_errors = nil
    if model_service_result.success?
      frontend_updates.update_staff_member_profile(staff_member: staff_member)
    else
      api_errors = StaffMemberUpdateContactDetailsApiErrors.new(staff_member: staff_member)
    end

    Result.new(model_service_result.staff_member, model_service_result.success?, api_errors)
  end

  def update_personal_details(params)
    assert_action_permitted(:update_personal_details)

    model_service_result = UpdateStaffMemberPersonalDetails.new(
      requester: requester,
      staff_member: staff_member,
      params: {
        gender: params.fetch(:gender),
        date_of_birth: UIRotaDate.parse(params.fetch(:date_of_birth)),
        name_attributes: {
          first_name: params.fetch(:first_name),
          surname: params.fetch(:surname),
        },
      },
    ).call

    api_errors = nil
    if model_service_result.success?
      frontend_updates.update_staff_member_profile(staff_member: staff_member)
    else
      api_errors = StaffMemberUpdatePersonalDetailsApiErrors.new(staff_member: staff_member)
    end

    Result.new(model_service_result.staff_member, model_service_result.success?, api_errors)
  end

  def update_employment_details(params)
    assert_action_permitted(:update_employment_details)

    master_venue = Venue.find_by(id: params.fetch(:master_venue_id))

    other_venues = params.fetch(:other_venue_ids).map do |id|
      Venue.find_by!(id: id)
    end
    pay_rate = PayRate.find_by!(id: params.fetch(:pay_rate_id))
    staff_type = StaffType.find_by!(id: params.fetch(:staff_type_id))

    update_params = {
      starts_at: UIRotaDate.parse(params.fetch(:starts_at)),
      pay_rate: pay_rate,
      staff_type: staff_type,
      master_venue: master_venue,
      work_venues: other_venues,
    }
    if ability.can?(:edit, :sage_id)
      # update_params[:allow_no_sage_id] = params.fetch(:allow_no_sage_id)
      # update_params[:sage_id] = params.fetch(:sage_id)
    end
    update_params[:national_insurance_number] = params[:national_insurance_number] if params[:national_insurance_number].present?
    update_params[:hours_preference_note] = params[:hours_preference_note] if params[:hours_preference_note].present?
    update_params[:day_perference_note] = params[:day_preference_note] if params[:day_preference_note].present?
    EmploymentStatusApiEnum.new(value: params.fetch(:employment_status)).to_params.each do |param, value|
      update_params[param] = value
    end
    update_params[:sia_badge_number] = params[:sia_badge_number] if params[:sia_badge_number].present?
    update_params[:sia_badge_expiry_date] = UIRotaDate.parse(params[:sia_badge_expiry_date]) if params[:sia_badge_expiry_date].present?

    model_service_result = UpdateStaffMemberEmploymentDetails.new(
      requester: requester,
      staff_member: staff_member,
      params: update_params,
    ).call

    api_errors = nil

    if model_service_result.success?
      frontend_updates.update_staff_member_profile(staff_member: staff_member)
    else
      api_errors = StaffMemberUpdateEmploymentDetailsApiErrors.new(staff_member: staff_member)
    end

    Result.new(staff_member, model_service_result.success?, api_errors)
  end

  def update_avatar(params)
    assert_action_permitted(:update_avatar)

    result = staff_member.update_attributes(
      avatar_data_uri: params.fetch(:avatar_base64),
    )

    api_errors = nil
    if result
      if staff_member.marked_retake_avatar?
        staff_member.clear_update_avatar!
      end

      frontend_updates.update_staff_member_profile(staff_member: staff_member)
    else
      api_errors = StaffMemberUpdateAvatarApiErrors.new(staff_member: staff_member)
    end

    Result.new(staff_member, result, api_errors)
  end

  private

  def assert_action_permitted(action)
    case action
    when :enable
      assert_user_authorized
    when :disable, :update_avatar, :update_contact_details, :update_personal_details, :update_employment_details
      assert_user_authorized
      assert_staff_member_enabled
    else
      raise "unsupported action: #{action} supplied"
    end
  end

  def assert_user_authorized
    ability.authorize!(:edit, staff_member)
  end

  def assert_staff_member_enabled
    raise "Attempt to update disabled staff_member" if staff_member.disabled?
  end
end
