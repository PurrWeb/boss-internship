class ShiftInDateRangeQuery
  def initialize(staff_member:, start_date:, end_date:)
    @staff_member = staff_member
    @start_date = start_date
    @end_date = end_date
  end

  def all
    query = staff_member.rota_shifts.enabled

    InRangeQuery.new(
      relation: query,
      start_value: RotaShiftDate.new(start_date).start_time,
      end_value: RotaShiftDate.new(end_date).end_time,
      include_boundaries: [:end]
    ).all
  end

  private
  attr_reader :start_date, :end_date, :staff_member
end
