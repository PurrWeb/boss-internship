class OwedHoursInWeekQuery
  def initialize(staff_member:, week:)
    @staff_member = staff_member
    @week = week
  end
  attr_reader :staff_member, :week

  def all
    OwedHour.
      enabled.
      where(
        week_start_date: week.start_date,
        staff_member: staff_member
      )
  end
end
