class StaffMembersAcceptedHoursByWeekQuery
  def initialize(week: RotaWeek.new(Time.current.to_date))
    @week = week
  end

  attr_reader :week

  def all
    clocking_day_ids = InRangeQuery.new(
      relation: ClockInDay.select("id"),
      start_value: week.start_date,
      end_value: week.end_date,
      start_column_name: 'date',
      end_column_name: 'date'
    ).all.map(&:id)

    StaffMember
      .enabled
      .regular
      .joins(clock_in_days: :hours_acceptance_periods)
      .merge(ClockInDay.where(id: clocking_day_ids))
      .group('staff_members.id')
      .sum('TIMESTAMPDIFF(hour, hours_acceptance_periods.starts_at, hours_acceptance_periods.ends_at)')
  end
end
