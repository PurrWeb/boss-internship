class UpdateStaffMembersOnAgedPayRates
  def initialize(now: Time.now)
    @now = now
  end
  attr_reader :now

  def call
    ActiveRecord::Base.transaction do
      StaffMember.enabled.with_aged_payrates.each do |staff_member|
        begin
          pay_rate = StaffMemberRealPayRate.new(now: now, staff_member: staff_member).call
          if  pay_rate.present?
            result = UpdateStaffMemberEmploymentDetails.new(staff_member: staff_member, pay_rate: pay_rate).call
            raise "Pay rate update to pay_rate: #{pay_rate.id} unsuccessful for staff_member:#{staff_member.id}" unless result.success?
          end
        rescue PayRateException => e
          Rollbar.error(e.message)
        end
      end
    end
  end
end
