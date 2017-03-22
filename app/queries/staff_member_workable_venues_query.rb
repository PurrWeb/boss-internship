class StaffMemberWorkableVenuesQuery
  def initialize(staff_member:)
    @staff_member = staff_member
  end
  attr_reader :staff_member

  def all
    ids = (Array(staff_member.master_venue.andand.id) + staff_member.work_venues.pluck(:id)).uniq
    Venue.where(id: ids)
  end
end
