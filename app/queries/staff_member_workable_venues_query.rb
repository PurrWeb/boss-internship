class StaffMemberWorkableVenuesQuery
  attr_reader :staff_member, :venues

  def initialize(params)
    @staff_member = params.fetch(:staff_member)
    @venues = params[:venues] || Venue
  end

  def all
    venues.where(
      id: [staff_member.master_venue.andand.id] + staff_member.work_venues.map(&:id)
    )
  end
end
