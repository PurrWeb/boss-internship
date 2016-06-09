class OverlappingHoursAcceptancePeriodQuery
  def initialize(starts_at:, ends_at:, clock_in_day:)
    @starts_at = starts_at
    @ends_at = ends_at
    @clock_in_day = clock_in_day
  end

  def all
    relation = HoursAcceptancePeriod.
      enabled.
      where(clock_in_day: clock_in_day)

    InRangeQuery.new(
      relation: relation,
      start_value: starts_at,
      end_value: ends_at,
      include_boundaries: false
    ).all
  end

  def count
    all.count
  end

  private
  attr_reader :starts_at, :ends_at, :clock_in_day
end
