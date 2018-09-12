class ClockableStaffMembersQuery
  def initialize(venue:, rota_shifts:, rota_date: RotaShiftDate.to_rota_date(Time.current))
    @venue = venue
    @rota_shifts = rota_shifts
    @rota_date = rota_date
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

    staff_with_holidays_ids = InRangeQuery.new(
      relation: Holiday.in_state(:enabled),
      start_value: rota_date,
      end_value: rota_date,
      start_column_name: "start_date",
      end_column_name: "end_date",
    ).all.pluck(:staff_member_id).uniq

    StaffMember.enabled.where(id: venue_members.pluck(:id) + security_staff_ids + rotaed_members_ids - staff_with_holidays_ids)
  end

  private

  attr_reader :rota_shifts, :rota_date
end
