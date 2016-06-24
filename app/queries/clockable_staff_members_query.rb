class ClockableStaffMembersQuery
  def initialize(venue:, rota_shifts:)
    @venue = venue
    @rota_shifts = rota_shifts
  end
  attr_reader :venue

  def all
    venue_members = StaffMember.for_venue(venue)

    rotaed_members = StaffMember.
      joins(:rota_shifts).
      merge(rota_shifts)

    security_staff = StaffMember.security

    ids = venue_members.pluck(:id) + security_staff.pluck(:id) + rotaed_members.pluck(:id)

    StaffMember.enabled.where(id: ids.uniq)
  end

  private
  attr_reader :rota_shifts
end
