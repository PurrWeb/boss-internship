class SecurityVenueShiftInRangeQuery
  def initialize(staff_member:, starts_at:, ends_at:)
    @staff_member = staff_member
    @starts_at = starts_at
    @ends_at = ends_at
  end

  def all
    query = InRangeQuery.new(
      relation: SecurityVenueShift.all,
      start_value: starts_at,
      end_value: ends_at,
      include_boundaries: []
    ).all
    query = query.where(staff_member: staff_member)
    query
  end

  private
  attr_reader :staff_member, :starts_at, :ends_at
end
