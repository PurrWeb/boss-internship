class StaffMembersOwedHoursByWeekQuery
  def initialize(week: RotaWeek.new(Time.current.to_date))
    @week = week
  end

  attr_reader :week

  def all
    owed_hours_ids = InRangeQuery.new(
      relation: OwedHour.enabled,
      start_value: week.start_date,
      end_value: week.end_date,
      start_column_name: 'date',
      end_column_name: 'date',
      include_boundaries: [:start, :end]
    ).all.map(&:id)

    StaffMember
      .enabled
      .regular
      .where.not(master_venue: nil)
      .joins(:owed_hours)
      .merge(OwedHour.where(id: owed_hours_ids))
      .group('staff_members.id')
      .sum('TIMESTAMPDIFF(minute, owed_hours.starts_at, owed_hours.ends_at)')
  end
end
