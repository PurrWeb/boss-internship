class StaffMemberProfilePermissions
  def initialize(current_user:, staff_member:, holidays: [], holiday_requests: [])
    @user_ability = UserAbility.new(current_user)
    @staff_member = staff_member
    @holidays = holidays
    @holiday_requests = holiday_requests
  end
  attr_reader :user_ability, :staff_member

  def can_enable?
    user_ability.can?(:enable, staff_member)
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
end
