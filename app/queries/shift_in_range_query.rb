class ShiftInRangeQuery
  def initialize(staff_member:, starts_at:, ends_at:)
    @staff_member = staff_member
    @starts_at = starts_at
    @ends_at = ends_at
  end

  def all
    query = InRangeQuery.new(
      relation: RotaShift.all,
      start_value: starts_at,
      end_value: ends_at
    ).all
    query = query.where(staff_member: staff_member)
    query
  end

  private
  attr_reader :staff_member, :starts_at, :ends_at
end
