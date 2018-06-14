class UpdateStaffMembersPayRate
  def initialize(now: Time.now)
    @now = now
  end

  def call
    errors = {}
    staff_members_payrates = StaffMember.enabled.inject({}) do |acc, staff_member|
      begin
        pay_rate = StaffMemberPayRateCheck.new(now: now, staff_member: staff_member).call
        if pay_rate.present?
          acc[staff_member.id] = pay_rate
        end
      rescue StandardError => error
        errors[staff_member.id] = error.message
      end
      acc
    end

    [staff_members_payrates, errors]
  end

  attr_reader :now
end
