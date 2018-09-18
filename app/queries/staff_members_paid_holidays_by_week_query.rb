class StaffMembersPaidHolidaysByWeekQuery
  def initialize(week: RotaWeek.new(Time.current.to_date))
    @week = week
  end

  attr_reader :week

  def all
    holiday_ids = InRangeQuery.new(
      relation: Holiday.where(holiday_type: Holiday::PAID_HOLIDAY_TYPE),
      start_value: week.start_date,
      end_value: week.end_date,
      start_column_name: 'start_date',
      end_column_name: 'end_date'
    ).all.map(&:id)

    StaffMember
      .enabled
      .regular
      .where.not(master_venue: nil)
      .joins(:holidays)
      .merge(Holiday.where(id: holiday_ids))
      .group('staff_members.id')
      .sum('TIMESTAMPDIFF(day, holidays.start_date, holidays.end_date)')
  end
end
