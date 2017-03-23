class ClockableStaffMembersQuery
  def initialize(venue:, rota_shifts:)
    @venue = venue
    @rota_shifts = rota_shifts
  end
  attr_reader :venue

  def all
    venue_members = StaffMember.for_venue(venue)
    rotaed_members = StaffMember.where(
      id: rota_shifts.map(&:staff_member_id).uniq
    )

    security_staff = StaffMember.where(
      staff_type_id: StaffType.security.map(&:id)
    )

    StaffMember.enabled.where(
      id: venue_members.map(&:id) + security_staff.map(&:id) + rotaed_members.map(&:id)
    )
  end

  private

  attr_reader :rota_shifts
end
