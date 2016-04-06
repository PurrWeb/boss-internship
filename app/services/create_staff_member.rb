class CreateStaffMember
  class Result < Struct.new(:success, :staff_member)
    def success?
      success
    end
  end

  def initialize(now: Time.now, params:, nested: false)
    @now = now
    @params = params
    @nested = nested
  end

  def call
    result = false
    staff_member = StaffMember.new

    ActiveRecord::Base.transaction(requires_new: nested) do
      staff_member.assign_attributes(params)

      # notified_of_sia_expiry_at is set to now if we don't want to send
      # an update
      if staff_member.security? && staff_member.sia_badge_expiry_date.present?
        if staff_member.sia_badge_expiry_date < now
          staff_member.notified_of_sia_expiry_at = now
        end
      end

      result = staff_member.save

      if result
        StaffMemberUpdatesMailer.new_staff_member(staff_member).deliver_later
      end
    end

    Result.new(result, staff_member)
  end

  private
  attr_reader :now, :nested, :params
end
