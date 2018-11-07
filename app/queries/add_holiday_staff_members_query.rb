class AddHolidayStaffMembersQuery
  def initialize(requester:, ability: UserAbility.new(requester))
    @requester = requester
    @ability = ability
  end

  def all(query: nil, venue: nil)
    staff_members = StaffMember.regular
    staff_members = staff_members.search(name: query) if query.present?
    staff_members = staff_members.where(master_venue: venue) if venue.present?

    staff_members.inject([]) do |acc, staff_member|
      acc << staff_member if ability.can?(:create_holiday, staff_member)
      acc
    end
  end

  private

  attr_reader :requester, :ability
end