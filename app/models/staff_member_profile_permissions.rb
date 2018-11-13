class StaffMemberProfilePermissions
  def initialize(
    current_user:,
    staff_member:,
    holidays: [],
    holiday_requests: [],
    owed_hours: [],
    disciplinaries: [],
    accessory_requests: AccessoryRequest.none
  )
    @user_ability = UserAbility.new(current_user)
    @staff_member = staff_member
    @holidays = holidays
    @holiday_requests = holiday_requests
    @owed_hours = owed_hours
    @accessory_requests = accessory_requests
    @disciplinaries = disciplinaries
  end
  attr_reader :user_ability, :staff_member

  def can_enable?
    user_ability.can?(:enable, staff_member)
  end

  def can_mark_retake_avatar?
    user_ability.can?(:mark_retake_avatar, staff_member)
  end

  def holidays_tab
    {
      canCreateHolidays: user_ability.can?(:create_holiday, staff_member),
      holidays: holidays,
      holidayRequests: holiday_requests
    }
  end

  def owed_hours_tab
    {
      canCreateOwedHours: user_ability.can?(:create, OwedHour.new(staff_member: staff_member)),
      owed_hours: owed_hours,
    }
  end

  def accessories_tab
    {
      canCreateAccessoryRequest: user_ability.can?(:create, AccessoryRequest.new(staff_member: staff_member)),
      accessory_requests: accessory_requests
    }
  end

  def disciplinaries_tab
    {
      canViewPage: user_ability.can?(:view_disciplinaries_page, staff_member),
      canCreateDisciplinary: user_ability.can?(:create_disciplinaries, staff_member),
      disciplinaries: disciplinaries,
    }
  end

  private
  def owed_hours
    result = {}
    @owed_hours.each do |owed_hour|
      result[owed_hour.id] = {
        isEditable: user_ability.can?(:edit, owed_hour),
        isDeletable: user_ability.can?(:destroy, owed_hour)
      }
    end
    result
  end

  def holidays
    result = {}
    @holidays.each do |holiday|
      result[holiday.id] = {
        isEditable: user_ability.can?(:edit, holiday),
        isDeletable: user_ability.can?(:destroy, holiday)
      }
    end
    result
  end

  def holiday_requests
    result = {}
    @holiday_requests.map do |holiday_request|
      result[holiday_request.id] = {
        isEditable: user_ability.can?(:edit, holiday_request),
        isDeletable: user_ability.can?(:destroy, holiday_request)
      }
    end
    result
  end

  def accessory_requests
    result = {}
    @accessory_requests.map do |accessory_request|
      result[accessory_request.id] = {
        isCancelable: user_ability.can?(:cancel, accessory_request),
        isRefundable: user_ability.can?(:refund_request, accessory_request)
      }
    end
    result
  end

  def disciplinaries
    result = {}
    @disciplinaries.map do |disciplinary|
      result[disciplinary.id] = {
        isDisablable: user_ability.can?(:disable, disciplinary)
      }
    end
    result
  end
end
