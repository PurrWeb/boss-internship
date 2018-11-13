class AddHolidayStaffMembersQuery
  def initialize(requester:, ability: UserAbility.new(requester))
    @requester = requester
    @ability = ability
  end

  def all(query: nil, venue: nil)
    staff_members = query.present? ? StaffMember.enabled : StaffMember.none

    fragments = (query || "").split
    if fragments.count > 0
    staff_members = staff_members.search(
      or: fragments.map do |fragment|
        {query: fragment}
      end
    )
    end

    staff_members = staff_members.where(master_venue: venue) if venue.present?

    staff_members.select {|staff_member| ability.can?(:create_holiday, staff_member)}
  end

  private

  attr_reader :requester, :ability
end