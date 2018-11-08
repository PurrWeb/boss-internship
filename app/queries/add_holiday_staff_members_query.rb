class AddHolidayStaffMembersQuery
  def initialize(requester:, ability: UserAbility.new(requester))
    @requester = requester
    @ability = ability
  end

  def all(query: nil, venue: nil)
    staff_members = StaffMember.regular
    staff_members = staff_members.search(name: query) if query.present?
    staff_members = staff_members.where(master_venue: venue) if venue.present?

    staff_members.select {|staff_member| ability.can?(:create_holiday, staff_member)}
  end

  private

  attr_reader :requester, :ability
end