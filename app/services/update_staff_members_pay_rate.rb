class UpdateStaffMembersPayRate
  def initialize(now: Time.now)
    @now = now
  end

  def call
    ActiveRecord::Base.transaction do
      staff_members_payrates = StaffMember.enabled.with_aged_payrates.each do |staff_member|
        begin
          pay_rate = StaffMemberRealPayRate.new(now: now, staff_member: staff_member).call
          if pay_rate.present?
              staff_member.update!(pay_rate: pay_rate)
          end
        rescue PayRateException => e
          pp e.message
        end
      end
    end
  end

  attr_reader :now
end
