class CreateStaffMember
  class Result < Struct.new(:success, :staff_member)
    def success?
      success
    end
  end

  def initialize(params:)
    @params = params
  end

  def class
    result = false
    staff_member = StaffMember.new

    ActiveRecord::Base.transaction do
      staff_member.assign_attributes(params)
      if staff_member.staff_member_venue.present? && staff_member.staff_member_venue.venue_id == nil
        staff_member.staff_member_venue.mark_for_destruction
      end

      result = staff_member.save
    end

    Result.new(result, staff_member)
  end

  private
  attr_reader :params
end
