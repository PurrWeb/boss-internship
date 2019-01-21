class UpdateStaffMemberPersonalDetails
  class Result < Struct.new(:success, :staff_member)
    def success?
      success
    end
  end

  def initialize(requester:, staff_member:, params:)
    @requester = requester
    @staff_member = staff_member
    @params = params
  end

  def call
    result = false

    ActiveRecord::Base.transaction do
      staff_member.assign_attributes(params)
      staff_member_updates_email = StaffMemberUpdatesEmail.new(user: requester, staff_member: staff_member, old_master_venue: staff_member.master_venue)
      result = staff_member.save

      if result && staff_member_updates_email.send?
        # StaffMemberUpdatesMailer.staff_member_updated(staff_member_updates_email.data).deliver_now
      end
    end

    Result.new(result, staff_member)
  end

  private
  attr_reader :staff_member, :params, :requester
end
