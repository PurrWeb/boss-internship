class StaffMemberSearchQuery
  def initialize(query: '', venue: nil)
    @query = query
    @venue = venue
  end

  def search(limit: 20)
    staff_members = StaffMember.where.not(master_venue: nil)
    staff_members = staff_members.search(name: query) if query.present?
    staff_members = staff_members.where(master_venue: venue) if venue.present?
    
    staff_members.limit(limit)
  end

  attr_reader :query, :venue 
end
