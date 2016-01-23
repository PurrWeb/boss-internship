class ShiftInDateRangeQuery
  def initialize(rota:, staff_member:, starts_at:, ends_at:)
    @rota = rota
    @staff_member = staff_member
    @starts_at = starts_at
    @ends_at = ends_at
  end

  def all
    query = RotaShift.all
    query = query.where('(? <= `ends_at`) AND (? >= `starts_at`)', starts_at, ends_at)
    query = query.where(staff_member: staff_member)
    query = query.where(rota: rota)
    query
  end

  private
  attr_reader :staff_member, :starts_at, :ends_at, :rota
end
