class ClockableStaffMembersQuery
  def initialize(venue:, rota_shifts:)
    @venue = venue
    @rota_shifts = rota_shifts
  end

  attr_reader :venue

  def all
    venue_members = StaffMember.for_venue(venue)
    rotaed_members_ids = StaffMember.where(
      id: rota_shifts.pluck(:staff_member_id).uniq,
    )

    security_staff_ids = StaffMember.where(
      staff_type_id: StaffType.security.pluck(:id),
    ).pluck(:id)

    StaffMember.enabled.where(id: venue_members.pluck(:id) + security_staff_ids + rotaed_members_ids)
  end

  private

  attr_reader :rota_shifts
end
