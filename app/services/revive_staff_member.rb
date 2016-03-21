class ReviveStaffMember
  class Result < Struct.new(:success, :staff_member)
    def success?
      success
    end
  end

  def initialize(requester:, staff_member:, staff_member_params:)
    @requester = requester
    @staff_member = staff_member
    @staff_member_params = staff_member_params
  end

  def call
    result = false

    ActiveRecord::Base.transaction do
      staff_member.assign_attributes(staff_member_params)
      if staff_member.staff_member_venue.present? && staff_member.staff_member_venue.venue_id == nil
        staff_member.staff_member_venue.mark_for_destruction
      end
      result = staff_member.save

      if result
        staff_member.
          state_machine.
          transition_to!(
            :enabled,
            requster_user_id: requester.id
          )
      end
      raise ActiveRecord::Rollback unless result
    end

    Result.new(result, staff_member)
  end

  private
  attr_reader :requester, :staff_member, :staff_member_params
end
