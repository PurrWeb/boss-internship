class StaffMemberWorkableVenuesQuery
  def initialize(staff_member:)
    @staff_member = staff_member
  end

  attr_reader :staff_member

  def all
    Venue.where(
      id: [staff_member.master_venue.andand.id] + staff_member.work_venues.map(&:id)
    )
  end
end
