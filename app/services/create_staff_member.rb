class CreateStaffMember
  class Result < Struct.new(:success, :staff_member)
    def success?
      success
    end
  end

  def initialize(params:, nested: false)
    @params = params
    @nested = nested
  end

  def call
    result = false
    staff_member = StaffMember.new

    ActiveRecord::Base.transaction(requires_new: nested) do
      staff_member.assign_attributes(params)
      if staff_member.staff_member_venue.present? && staff_member.staff_member_venue.venue_id == nil
        staff_member.staff_member_venue.mark_for_destruction
      end

      result = staff_member.save
    end

    Result.new(result, staff_member)
  end

  private
  attr_reader :params, :nested
end
