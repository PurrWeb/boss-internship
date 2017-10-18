#Used to trigger conditional validation error when requester doesn't have access to the payrate
class StaffMemberPostAssignAccessiblePayRateValidation
  def initialize(requester:)
    @requester = requester
  end
  attr_reader :requester

  def call(staff_member:)
    if staff_member.pay_rate && staff_member.pay_rate_changed?
      if !PayRate.selectable_by(requester).include?(staff_member.pay_rate)
        staff_member.has_pay_rate_without_access = true
      end
    end
  end
end
