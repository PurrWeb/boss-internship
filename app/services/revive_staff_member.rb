class ReviveStaffMember
  class Result < Struct.new(:success, :staff_member)
    def success?
      success
    end
  end

  def initialize(requester:, staff_member:, staff_member_params:)
    @requester = requester
    @staff_member = staff_member
    @staff_member_params = normalise_params(staff_member_params)
  end

  def normalise_params(params)
    result = params.dup
    if params["email_address_attributes"].present? && staff_member.email_address.present?
      if params["email_address_attributes"]["email"] == staff_member.email_address.email
        result.delete("email_address_attributes")
      end
    end
    result
  end

  def call
    now = Time.current
    result = false

    ActiveRecord::Base.transaction do
      staff_member.assign_attributes(staff_member_params)
      result = staff_member.save

      if result
        staff_member.
          state_machine.
          transition_to!(
            :enabled,
            requster_user_id: requester.id
          )
        StaffTrackingEvent.create!(
          at: now,
          staff_member: staff_member,
          event_type: StaffTrackingEvent::REENABLE_EVENT_TYPE
        )
        StaffMemberUpdatesMailer.staff_member_revived(staff_member).deliver_now
      end
      raise ActiveRecord::Rollback unless result
    end

    Result.new(result, staff_member)
  end

  private
  attr_reader :requester, :staff_member, :staff_member_params
end
