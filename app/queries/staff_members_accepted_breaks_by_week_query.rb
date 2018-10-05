class StaffMembersAcceptedBreaksByWeekQuery
  def initialize(week: RotaWeek.new(Time.current.to_date))
    @week = week
  end

  attr_reader :week

  def all
    clocking_day_ids = InRangeQuery.new(
      relation: ClockInDay.select("id"),
      start_value: week.start_date,
      end_value: week.end_date,
      start_column_name: "date",
      end_column_name: "date",
      include_boundaries: [:start, :end]
    ).all.map(&:id)

    StaffMember
      .enabled
      .regular
      .joins(clock_in_days: {hours_acceptance_periods: :hours_acceptance_breaks})
      .where.not(master_venue: nil)
      .where(hours_acceptance_periods: {status: HoursAcceptancePeriod::ACCEPTED_STATE})
      .where(hours_acceptance_breaks: {disabled_at: nil})
      .merge(ClockInDay.where(id: clocking_day_ids))
      .group("staff_members.id")
      .sum("TIMESTAMPDIFF(minute, hours_acceptance_breaks.starts_at, hours_acceptance_breaks.ends_at)")
  end
end
